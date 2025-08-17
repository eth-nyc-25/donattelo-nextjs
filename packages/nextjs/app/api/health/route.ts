import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check Flask backend health
    const flaskBackendUrl = "http://127.0.0.1:5000";

    const response = await fetch(`${flaskBackendUrl}/health`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Flask backend is not responding");
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      frontend: "Next.js frontend is healthy",
      backend: data,
      message: "Both frontend and backend are connected and healthy",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        frontend: "Next.js frontend is healthy",
        backend: "Flask backend is not reachable",
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Frontend is healthy but backend connection failed",
      },
      { status: 503 },
    );
  }
}
