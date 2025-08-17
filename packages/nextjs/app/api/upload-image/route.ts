import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Validate file type (allow more types as per your Flask backend)
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif", "image/bmp", "image/webp"];
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Allowed: PNG, JPG, JPEG, GIF, BMP, WEBP",
        },
        { status: 400 },
      );
    }

    // Validate file size (16MB max as per your Flask config)
    if (image.size > 16 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 16MB" }, { status: 400 });
    }

    // Create FormData to send to Flask backend
    const flaskFormData = new FormData();
    flaskFormData.append("image", image);

    // Flask backend URL
    const flaskBackendUrl = "http://127.0.0.1:5000";

    // Send to Flask backend for image analysis and Walrus storage
    const response = await fetch(`${flaskBackendUrl}/analyze/image`, {
      method: "POST",
      body: flaskFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to analyze image");
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      image_url: data.image_url,
      image_blob_id: data.image_blob_id,
      metadata_blob_id: data.metadata_blob_id,
      image_object_id: data.image_object_id,
      metadata_object_id: data.metadata_object_id,
      metadata: data.metadata,
      message: "Image successfully analyzed and stored on Walrus",
    });
  } catch (error) {
    console.error("Error processing image upload:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to process image",
      },
      { status: 500 },
    );
  }
}
