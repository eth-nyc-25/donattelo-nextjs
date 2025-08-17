import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.OPENSEA_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "OpenSea API key not configured" }, { status: 500 });
    }

    // Test OpenSea API v2 connection with a more reliable endpoint
    const response = await fetch("https://api.opensea.io/api/v2/collections", {
      headers: {
        "X-API-KEY": apiKey,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      // Get more detailed error information
      let errorDetails = `Status: ${response.status}`;
      try {
        const errorData = await response.text();
        if (errorData) {
          errorDetails += `, Response: ${errorData}`;
        }
      } catch {
        // Ignore error parsing errors
      }

      throw new Error(`OpenSea API responded with ${errorDetails}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "OpenSea API connection successful",
      timestamp: new Date().toISOString(),
      apiVersion: "v2",
      testEndpoint: "/collections",
      response: data,
      apiKeyLength: apiKey.length,
      apiKeyPrefix: apiKey.substring(0, 8) + "...",
    });
  } catch (error) {
    console.error("OpenSea API connection test failed:", error);

    return NextResponse.json(
      {
        error: "Failed to connect to OpenSea API",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
