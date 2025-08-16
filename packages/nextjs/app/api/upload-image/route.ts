import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Validate file type
    if (image.type !== "image/png") {
      return NextResponse.json({ error: "Only PNG files are allowed" }, { status: 400 });
    }

    // Validate file size (10MB max)
    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 });
    }

    // Convert file to base64 for sending to Python backend
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // TODO: Replace with your actual Python Flask backend URL
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || "http://localhost:5000";

    // Send to Python backend for SVG conversion and Walrus storage
    const response = await fetch(`${pythonBackendUrl}/api/convert-to-svg`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64Image,
        filename: image.name,
        mimeType: image.type,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to convert image to SVG");
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      walrusUrl: data.walrusUrl,
      svgContent: data.svgContent,
      message: "Image successfully converted to SVG and stored on Walrus",
    });
  } catch (error) {
    console.error("Error processing image upload:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
