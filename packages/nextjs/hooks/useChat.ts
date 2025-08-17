// Custom React hook for managing chat with Gemini AI and Walrus storage
import { useCallback, useState } from "react";
import { checkFlaskHealth, sendChatMessage, uploadImageToWalrus, validateImageFile } from "~~/lib/flask-api";
import { ChatMessage, WalrusUploadResponse } from "~~/types/flask-api";

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isHealthy: boolean;
  sendMessage: (message: string, imageFile?: File) => Promise<void>;
  clearMessages: () => void;
  checkHealth: () => Promise<void>;
}

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      content:
        "Hello! I'm Donatello, your AI-powered creative assistant. I can help you analyze images, store them permanently on Walrus, and create NFTs. Upload an image or ask me anything about digital art!",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHealthy, setIsHealthy] = useState(true);

  const checkHealth = useCallback(async () => {
    try {
      await checkFlaskHealth();
      setIsHealthy(true);
      console.log("✅ Flask backend is healthy");
    } catch (error) {
      setIsHealthy(false);
      console.warn("⚠️ Flask backend health check failed:", error);
    }
  }, []);

  const sendMessage = useCallback(async (message: string, imageFile?: File) => {
    if (!message.trim() && !imageFile) return;

    setIsLoading(true);

    // Add user message to chat
    const userMessage: ChatMessage = {
      role: "user",
      content: message || (imageFile ? `🎨 Uploading and analyzing: ${imageFile.name}` : ""),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      let walrusResult: WalrusUploadResponse | undefined;

      // Handle image upload if provided
      if (imageFile) {
        // Validate file first
        const validation = validateImageFile(imageFile);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        // Upload to Walrus via Flask
        console.log("📤 Uploading image to Walrus...");
        walrusResult = await uploadImageToWalrus(imageFile);

        // Log comprehensive Walrus storage info
        console.log("🐋 Walrus Storage Complete:");
        console.log("- Image Blob ID:", walrusResult.image_blob_id);
        console.log("- Metadata Blob ID:", walrusResult.metadata_blob_id);
        console.log("- Image Object ID:", walrusResult.image_object_id);
        console.log("- Metadata Object ID:", walrusResult.metadata_object_id);
        console.log("- Flask Proxy URL:", walrusResult.image_url);
        console.log(
          "- Direct Walrus URL:",
          `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${walrusResult.image_blob_id}`,
        );
        console.log("- File Info:", walrusResult.metadata.file_info);

        // Update user message with image context
        userMessage.imageContext = walrusResult;
      }

      // Send message to Gemini AI via Flask
      const geminiPrompt = imageFile
        ? `User uploaded an image: ${imageFile.name}. 
             
             Image stored on Walrus with blob ID: ${walrusResult?.image_blob_id}
             Direct Walrus URL: https://aggregator.walrus-testnet.walrus.space/v1/blobs/${walrusResult?.image_blob_id}
             
             Provide creative insights about this image. Mention the Walrus storage success and ask if they want to mint it as an NFT or create variations.
             
             User message: ${message || "What do you think of this image?"}`
        : message;

      console.log("🤖 Sending to Gemini AI...");
      const geminiResponse = await sendChatMessage(geminiPrompt, walrusResult);

      if (geminiResponse.success) {
        const aiMessage: ChatMessage = {
          role: "model",
          content: geminiResponse.response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);

        // Log Gemini response for debugging
        console.log("✅ Gemini AI Response:", geminiResponse.response);
      } else {
        throw new Error(geminiResponse.error || "Failed to get AI response");
      }
    } catch (error) {
      console.error("❌ Chat error:", error);

      // Create appropriate error message based on the type of failure
      let errorContent = "Sorry, I encountered an error. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("file type")) {
          errorContent = "❌ " + error.message + "\n\nPlease upload a PNG, JPG, JPEG, GIF, BMP, or WEBP file.";
        } else if (error.message.includes("file size")) {
          errorContent = "❌ " + error.message + "\n\nPlease choose a smaller image (max 16MB).";
        } else if (error.message.includes("Chat failed") || error.message.includes("Upload failed")) {
          errorContent = `❌ ${error.message}\n\n🔍 Make sure your Flask backend is running on http://127.0.0.1:5000`;
        } else {
          errorContent = `❌ ${error.message}`;
        }
      }

      const errorMessage: ChatMessage = {
        role: "model",
        content: errorContent,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);

      // Update health status if it's a connectivity issue
      if (error instanceof Error && error.message.includes("failed to fetch")) {
        setIsHealthy(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        role: "model",
        content:
          "Hello! I'm Donatello, your AI-powered creative assistant. I can help you analyze images, store them permanently on Walrus, and create NFTs. Upload an image or ask me anything about digital art!",
        timestamp: new Date(),
      },
    ]);
  }, []);

  return {
    messages,
    isLoading,
    isHealthy,
    sendMessage,
    clearMessages,
    checkHealth,
  };
};
