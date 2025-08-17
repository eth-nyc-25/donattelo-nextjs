export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface OpenSeaListing {
  price: string;
  paymentToken: string;
  listingType: "fixed_price" | "auction" | "dutch_auction";
  duration?: number; // in seconds
  startTime?: Date;
  endTime?: Date;
}

export interface NFTData {
  tokenId: number;
  contractAddress: string;
  metadata: NFTMetadata;
  creator: string;
  createdAt: Date;
  status: "draft" | "minted" | "listed" | "sold";
}

export class OpenSeaService {
  private apiKey: string;
  private baseURL: string;
  private sandboxURL: string;

  constructor() {
    this.apiKey = process.env.OPENSEA_API_KEY || "";
    this.baseURL = process.env.OPENSEA_API_BASE || "https://api.opensea.io/api/v2";
    this.sandboxURL = process.env.OPENSEA_SANDBOX_BASE || "https://testnets-api.opensea.io/api/v2";

    if (!this.apiKey) {
      throw new Error("OpenSea API key is required. Please set OPENSEA_API_KEY in your environment variables.");
    }
  }

  /**
   * Test OpenSea API connection
   */
  async testConnection(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await fetch(`${this.baseURL}/collections`, {
        headers: {
          "X-API-KEY": this.apiKey,
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

        throw new Error(`API responded with ${errorDetails}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: "OpenSea API connection successful",
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get collection statistics
   */
  async getCollectionStats(contractAddress: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/collections/${contractAddress}/stats`, {
        headers: {
          "X-API-KEY": this.apiKey,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to get collection stats: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Get NFT details
   */
  async getNFTDetails(contractAddress: string, tokenId: number): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/chain/ethereum/contract/${contractAddress}/nfts/${tokenId}`, {
        headers: {
          "X-API-KEY": this.apiKey,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to get NFT details: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Create NFT metadata following OpenSea standards
   */
  createNFTMetadata(
    name: string,
    description: string,
    imageUrl: string,
    creator: string,
    additionalAttributes?: Array<{ trait_type: string; value: string | number }>,
  ): NFTMetadata {
    const baseAttributes = [
      {
        trait_type: "Creator",
        value: creator,
      },
      {
        trait_type: "Platform",
        value: "Donattelo",
      },
      {
        trait_type: "Created At",
        value: new Date().toISOString(),
      },
    ];

    const attributes = additionalAttributes ? [...baseAttributes, ...additionalAttributes] : baseAttributes;

    return {
      name,
      description,
      image: imageUrl,
      external_url: "https://donattelo.vercel.app",
      attributes,
    };
  }

  /**
   * Prepare NFT for OpenSea listing
   */
  prepareNFTListing(nftData: NFTData, listingOptions: OpenSeaListing): any {
    return {
      nft: nftData,
      listing: {
        ...listingOptions,
        openseaUrl: `https://opensea.io/assets/ethereum/${nftData.contractAddress}/${nftData.tokenId}`,
        collectionUrl: `https://opensea.io/collection/${nftData.contractAddress}`,
      },
      metadata: {
        ...nftData.metadata,
        opensea: {
          collection: nftData.contractAddress,
          token_id: nftData.tokenId,
          chain: "ethereum",
        },
      },
    };
  }

  /**
   * Validate NFT metadata for OpenSea compatibility
   */
  validateMetadata(metadata: NFTMetadata): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!metadata.name || metadata.name.trim().length === 0) {
      errors.push("NFT name is required");
    }

    if (!metadata.description || metadata.description.trim().length === 0) {
      errors.push("NFT description is required");
    }

    if (!metadata.image || !metadata.image.startsWith("http")) {
      errors.push("Valid image URL is required");
    }

    if (metadata.name && metadata.name.length > 100) {
      errors.push("NFT name must be less than 100 characters");
    }

    if (metadata.description && metadata.description.length > 1000) {
      errors.push("NFT description must be less than 1000 characters");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get recommended pricing based on collection stats
   */
  async getRecommendedPricing(contractAddress: string): Promise<{
    floorPrice?: string;
    averagePrice?: string;
    recommendedPrice?: string;
  }> {
    try {
      const stats = await this.getCollectionStats(contractAddress);

      const floorPrice = stats.stats?.floor_price;
      const averagePrice = stats.stats?.average_price;

      let recommendedPrice = "0.01 ETH"; // Default fallback

      if (floorPrice) {
        // Recommend 20% above floor price
        const floorPriceNum = parseFloat(floorPrice);
        recommendedPrice = `${(floorPriceNum * 1.2).toFixed(4)} ETH`;
      } else if (averagePrice) {
        // Use average price as reference
        recommendedPrice = `${averagePrice} ETH`;
      }

      return {
        floorPrice,
        averagePrice,
        recommendedPrice,
      };
    } catch (error) {
      console.warn("Could not get recommended pricing:", error);
      return {
        recommendedPrice: "0.01 ETH",
      };
    }
  }

  /**
   * Refresh NFT metadata on OpenSea
   */
  async refreshNFTMetadata(contractAddress: string, tokenId: number): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseURL}/chain/ethereum/contract/${contractAddress}/nfts/${tokenId}/refresh`,
        {
          method: "POST",
          headers: {
            "X-API-KEY": this.apiKey,
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to refresh NFT metadata: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}

// Export a singleton instance
export const openseaService = new OpenSeaService();
