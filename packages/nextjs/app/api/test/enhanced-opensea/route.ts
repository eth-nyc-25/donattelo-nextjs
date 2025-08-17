import { NextRequest, NextResponse } from "next/server";
import { openseaService } from "../../../../lib/opensea-service";

export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json();

    switch (action) {
      case "test_connection":
        return await handleTestConnection();

      case "get_collection_stats":
        return await handleGetCollectionStats(params.contractAddress);

      case "get_nft_details":
        return await handleGetNFTDetails(params.contractAddress, params.tokenId);

      case "create_nft_metadata":
        return await handleCreateNFTMetadata(params);

      case "validate_metadata":
        return await handleValidateMetadata(params.metadata);

      case "get_recommended_pricing":
        return await handleGetRecommendedPricing(params.contractAddress);

      case "refresh_metadata":
        return await handleRefreshMetadata(params.contractAddress, params.tokenId);

      default:
        return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
    }
  } catch (error) {
    console.error("Enhanced OpenSea API error:", error);

    return NextResponse.json(
      {
        error: "Request failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

async function handleTestConnection() {
  try {
    const result = await openseaService.testConnection();
    return NextResponse.json({
      success: result.success,
      message: result.message,
      data: result.data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error(`Connection test failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

async function handleGetCollectionStats(contractAddress: string) {
  if (!contractAddress) {
    throw new Error("Contract address is required");
  }

  try {
    const stats = await openseaService.getCollectionStats(contractAddress);
    return NextResponse.json({
      success: true,
      message: "Collection stats retrieved successfully",
      contractAddress,
      stats,
      openseaUrl: `https://opensea.io/collection/${contractAddress}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error(`Failed to get collection stats: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

async function handleGetNFTDetails(contractAddress: string, tokenId: number) {
  if (!contractAddress || !tokenId) {
    throw new Error("Contract address and token ID are required");
  }

  try {
    const details = await openseaService.getNFTDetails(contractAddress, tokenId);
    return NextResponse.json({
      success: true,
      message: "NFT details retrieved successfully",
      contractAddress,
      tokenId,
      details,
      openseaUrl: `https://opensea.io/assets/ethereum/${contractAddress}/${tokenId}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error(`Failed to get NFT details: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

async function handleCreateNFTMetadata(params: any) {
  const { name, description, imageUrl, creator, additionalAttributes } = params;

  if (!name || !description || !imageUrl || !creator) {
    throw new Error("Name, description, image URL, and creator are required");
  }

  try {
    const metadata = openseaService.createNFTMetadata(name, description, imageUrl, creator, additionalAttributes);

    return NextResponse.json({
      success: true,
      message: "NFT metadata created successfully",
      metadata,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error(`Failed to create NFT metadata: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

async function handleValidateMetadata(metadata: any) {
  if (!metadata) {
    throw new Error("Metadata is required");
  }

  try {
    const validation = openseaService.validateMetadata(metadata);
    return NextResponse.json({
      success: true,
      message: "Metadata validation completed",
      validation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error(`Failed to validate metadata: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

async function handleGetRecommendedPricing(contractAddress: string) {
  if (!contractAddress) {
    throw new Error("Contract address is required");
  }

  try {
    const pricing = await openseaService.getRecommendedPricing(contractAddress);
    return NextResponse.json({
      success: true,
      message: "Recommended pricing retrieved successfully",
      contractAddress,
      pricing,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error(`Failed to get recommended pricing: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

async function handleRefreshMetadata(contractAddress: string, tokenId: number) {
  if (!contractAddress || !tokenId) {
    throw new Error("Contract address and token ID are required");
  }

  try {
    const result = await openseaService.refreshNFTMetadata(contractAddress, tokenId);
    return NextResponse.json({
      success: true,
      message: "NFT metadata refresh initiated successfully",
      contractAddress,
      tokenId,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error(`Failed to refresh metadata: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
