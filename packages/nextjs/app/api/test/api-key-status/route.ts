import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.OPENSEA_API_KEY;

    return NextResponse.json({
      success: true,
      message: "API key status checked",
      status: {
        exists: !!apiKey,
        length: apiKey ? apiKey.length : 0,
        prefix: apiKey ? apiKey.substring(0, 8) + "..." : "N/A",
        format: apiKey ? (apiKey.startsWith("2") ? "Valid format" : "Unexpected format") : "N/A",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API key status check failed:", error);

    return NextResponse.json(
      {
        error: "Failed to check API key status",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
