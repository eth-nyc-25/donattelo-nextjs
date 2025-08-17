import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { creatorAddress, name, description, imageUrl } = await request.json();
    const apiKey = process.env.OPENSEA_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "OpenSea API key not configured" }, { status: 500 });
    }

    if (!creatorAddress || !name || !description || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields: creatorAddress, name, description, imageUrl" },
        { status: 400 },
      );
    }

    // Generate a mock token ID for testing purposes
    const tokenId = Math.floor(Math.random() * 1000000);

    // Create NFT metadata following OpenSea standards
    const nftMetadata = {
      name,
      description,
      image: imageUrl,
      external_url: "https://donattelo.vercel.app",
      attributes: [
        {
          trait_type: "Creator",
          value: creatorAddress,
        },
        {
          trait_type: "Platform",
          value: "Donattelo",
        },
        {
          trait_type: "Created At",
          value: new Date().toISOString(),
        },
        {
          trait_type: "Test NFT",
          value: "Yes",
        },
      ],
    };

    // For testing purposes, we'll simulate the NFT creation process
    // In a real implementation, this would:
    // 1. Mint the NFT on the blockchain
    // 2. Upload metadata to IPFS or similar
    // 3. Create OpenSea listing

    const mockNFTData = {
      tokenId,
      contractAddress: "0x1234567890123456789012345678901234567890", // Mock contract
      metadata: nftMetadata,
      creator: creatorAddress,
      createdAt: new Date().toISOString(),
      status: "created",
      nextSteps: [
        "Deploy NFT contract to blockchain",
        "Mint NFT with generated token ID",
        "Upload metadata to decentralized storage",
        "Create OpenSea listing",
        "Set price and listing parameters",
      ],
    };

    // Simulate OpenSea listing preparation
    const listingData = {
      nft: mockNFTData,
      listing: {
        price: "0.01 ETH",
        duration: "7 days",
        paymentToken: "ETH",
        listingType: "fixed_price",
      },
      openseaUrl: `https://opensea.io/assets/ethereum/${mockNFTData.contractAddress}/${tokenId}`,
    };

    return NextResponse.json({
      success: true,
      message: "Test NFT created successfully",
      timestamp: new Date().toISOString(),
      nft: mockNFTData,
      listing: listingData,
      note: "This is a test NFT. In production, this would be minted on-chain and listed on OpenSea.",
    });
  } catch (error) {
    console.error("Failed to create test NFT:", error);

    return NextResponse.json(
      {
        error: "Failed to create test NFT",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
