import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { contractAddress } = await request.json();
    const apiKey = process.env.OPENSEA_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "OpenSea API key not configured" }, { status: 500 });
    }

    if (!contractAddress) {
      return NextResponse.json({ error: "Contract address is required" }, { status: 400 });
    }

    // Get collection stats from OpenSea API v2
    const response = await fetch(`https://api.opensea.io/api/v2/collections/${contractAddress}/stats`, {
      headers: {
        "X-API-KEY": apiKey,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Collection not found on OpenSea" }, { status: 404 });
      }
      throw new Error(`OpenSea API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "Collection stats retrieved successfully",
      timestamp: new Date().toISOString(),
      contractAddress,
      stats: data,
      openseaUrl: `https://opensea.io/collection/${contractAddress}`,
    });
  } catch (error) {
    console.error("Failed to get collection stats:", error);

    return NextResponse.json(
      {
        error: "Failed to retrieve collection stats",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
