// OpenSea Configuration Example
// Copy this file to opensea-config.ts and fill in your actual values

export const OPENSEA_CONFIG = {
  // Your OpenSea API key (get from https://docs.opensea.io/reference/api-overview)
  API_KEY: "your_opensea_api_key_here",

  // API base URLs
  BASE_URL: "https://api.opensea.io/api/v2",
  SANDBOX_URL: "https://testnets-api.opensea.io/api/v2",

  // Default chain (Ethereum mainnet)
  DEFAULT_CHAIN: "ethereum",

  // Testnet configuration
  TESTNET: {
    enabled: false,
    chainId: 11155111, // Sepolia
    baseUrl: "https://testnets-api.opensea.io/api/v2",
  },

  // NFT metadata defaults
  METADATA: {
    external_url: "https://donattelo.vercel.app",
    platform: "Donattelo",
    max_name_length: 100,
    max_description_length: 1000,
  },

  // Listing defaults
  LISTING: {
    default_duration: 7 * 24 * 60 * 60, // 7 days in seconds
    default_payment_token: "ETH",
    default_listing_type: "fixed_price" as const,
  },
};

// Environment variable mapping
export const getOpenSeaConfig = () => ({
  apiKey: process.env.OPENSEA_API_KEY || OPENSEA_CONFIG.API_KEY,
  baseURL: process.env.OPENSEA_API_BASE || OPENSEA_CONFIG.BASE_URL,
  sandboxURL: process.env.OPENSEA_SANDBOX_BASE || OPENSEA_CONFIG.SANDBOX_URL,
  useTestnet: process.env.NEXT_PUBLIC_USE_TESTNET === "true",
  testnetChainId: process.env.NEXT_PUBLIC_TESTNET_CHAIN_ID || OPENSEA_CONFIG.TESTNET.chainId,
});
