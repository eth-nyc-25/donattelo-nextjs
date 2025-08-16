import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, imageFile, svgUrl } = body;

    // TODO: Replace with your actual Python Flask backend URL
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || "http://localhost:5000";

    // Send chat message to Python backend
    const response = await fetch(`${pythonBackendUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        hasImage: imageFile,
        svgUrl,
        // address: body.address, // User's wallet address
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get response from AI");
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      response: data.response,
      canMintNFT: data.canMintNFT || false,
      svgUrl: data.svgUrl,
    });
  } catch (error) {
    console.error("Error processing chat message:", error);
    return NextResponse.json({
      success: false,
      response: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
    });
  }
}
