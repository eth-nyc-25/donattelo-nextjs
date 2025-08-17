import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, imageFile, image_blob_id, metadata, image_url } = body;

    // Flask backend URL
    const flaskBackendUrl = "http://127.0.0.1:5000";

    let aiResponse = "";
    let walrusUrl = "";

    if (imageFile && image_blob_id) {
      // If an image was uploaded, show Walrus storage info and let Gemini respond
      walrusUrl = image_url || `${flaskBackendUrl}/image/${image_blob_id}`;

      // Log Walrus storage details for debugging
      console.log("🐋 Walrus Storage Details:");
      console.log("- Image Blob ID:", image_blob_id);
      console.log("- Walrus URL:", walrusUrl);
      console.log("- Metadata:", metadata);

      // Send to Gemini AI for response about the uploaded image
      try {
        const geminiResponse = await fetch(`${flaskBackendUrl}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `User uploaded an image. Analyze this image and provide creative insights. 
            Image stored on Walrus at: ${walrusUrl}
            Metadata: ${JSON.stringify(metadata)}
            Ask if they want to mint it as NFT or create variations.`,
            image_blob_id: image_blob_id,
            image_url: walrusUrl,
          }),
        });

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          aiResponse = geminiData.response || "Image analyzed successfully!";
        } else {
          // Fallback response with Walrus URL
          aiResponse = `🎨 Perfect! Your image has been analyzed and stored on Walrus!

📍 **Walrus Storage URL**: ${walrusUrl}

Here's what I found:
${
  metadata
    ? `• Image dimensions: ${metadata.width || "N/A"} x ${metadata.height || "N/A"}
• File size: ${metadata.file_size ? Math.round(metadata.file_size / 1024) + " KB" : "N/A"}
• Format: ${metadata.format || "Unknown"}
• Colors detected: ${metadata.dominant_colors ? metadata.dominant_colors.slice(0, 3).join(", ") : "Available"}`
    : "• Analysis complete!"
}

Your image is permanently stored and ready for NFT minting! Would you like to proceed with minting?`;
        }
      } catch (error) {
        console.error("Gemini API error:", error);
        aiResponse = `🎨 Image uploaded and stored successfully!

📍 **Walrus Storage URL**: ${walrusUrl}
📋 **Blob ID**: ${image_blob_id}

Your image is now permanently stored on Walrus! The AI analysis service is temporarily unavailable, but your image is safe and ready for NFT minting.`;
      }
    } else if (message && message.trim()) {
      // Handle text-only messages through Gemini
      try {
        const geminiResponse = await fetch(`${flaskBackendUrl}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
            context: "digital_art_nft_assistant",
          }),
        });

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          aiResponse = geminiData.response || "I understand your message!";
        } else {
          throw new Error("Gemini API not available");
        }
      } catch (error) {
        console.error("Gemini API error:", error);
        // Fallback responses
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes("mint") || lowerMessage.includes("nft")) {
          aiResponse =
            "🚀 I can help you mint your artwork as an NFT! Please upload an image first, and I'll guide you through the minting process on your preferred blockchain.";
        } else if (lowerMessage.includes("upload") || lowerMessage.includes("image")) {
          aiResponse =
            "📸 Please use the upload button to share your image (PNG, JPG, JPEG, GIF, BMP, or WEBP - up to 16MB). I'll analyze it and store it securely on Walrus!";
        } else if (lowerMessage.includes("walrus") || lowerMessage.includes("storage")) {
          aiResponse =
            "🐋 Walrus provides decentralized, permanent storage for your digital assets - perfect for NFT metadata!";
        } else {
          aiResponse =
            "I'm your AI creative assistant! Upload an image to get started, or ask me about NFTs and digital art.";
        }
      }
    } else {
      aiResponse = "Hello! I'm ready to help you create amazing digital art. Upload an image or ask me anything!";
    }

    // Check Flask backend health (optional)
    try {
      const healthCheck = await fetch(`${flaskBackendUrl}/health`, { method: "GET" });
      if (!healthCheck.ok) {
        console.warn("Flask backend health check failed");
      }
    } catch (error) {
      console.warn("Flask backend not reachable:", error);
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      canMintNFT: !!image_blob_id,
      image_blob_id: image_blob_id || null,
      walrus_url: walrusUrl || null,
    });
  } catch (error) {
    console.error("Error processing chat message:", error);
    return NextResponse.json({
      success: false,
      response: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
    });
  }
}
