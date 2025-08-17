# NFT Minting Setup Guide

## 1. Deploy DonatelloNFT Contract to Base

### Step 1: Set up your environment
```bash
cd packages/foundry

# Copy the environment file
cp .env.example .env

# Add your private key (for Base deployment)
# Edit .env file and add:
# DEPLOYER_PRIVATE_KEY=your_private_key_here
# Or generate a new account:
yarn generate
```

### Step 2: Add Base network configuration
Add this to your `foundry.toml`:

```toml
[profile.base]
src = "contracts"
out = "out"
libs = ["lib"]
remappings = [
    "@openzeppelin/=lib/openzeppelin-contracts/",
    "forge-std/=lib/forge-std/src/"
]

[rpc_endpoints]
base = "https://mainnet.base.org"
base_sepolia = "https://sepolia.base.org"
```

### Step 3: Deploy to Base Sepolia (testnet)
```bash
# Deploy to Base Sepolia testnet
forge script script/DeployDonatelloNFT.s.sol --rpc-url base_sepolia --broadcast --verify

# Or deploy to Base mainnet
forge script script/DeployDonatelloNFT.s.sol --rpc-url base --broadcast --verify
```

### Step 4: Update the contract address
After deployment, copy the contract address and update it in:
`packages/nextjs/components/NFTMinter.tsx`

Replace:
```typescript
const DONATELLO_NFT_CONTRACT = "0x..." as `0x${string}`;
```

With your deployed contract address.

## 2. Add Contract to deployedContracts.ts

Add your contract to `packages/nextjs/contracts/deployedContracts.ts`:

```typescript
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  // ... existing contracts
  8453: { // Base mainnet chain ID
    DonatelloNFT: {
      address: "YOUR_DEPLOYED_CONTRACT_ADDRESS",
      abi: [
        // Copy the ABI from packages/foundry/out/DonatelloNFT.sol/DonatelloNFT.json
      ]
    }
  },
  84532: { // Base Sepolia testnet chain ID  
    DonatelloNFT: {
      address: "YOUR_DEPLOYED_CONTRACT_ADDRESS",
      abi: [
        // Same ABI as above
      ]
    }
  }
} as const;

export default deployedContracts;
```

## 3. Test the Integration

1. Upload an image through the Donatello messenger
2. Wait for Walrus storage confirmation  
3. The NFT Minter component should appear automatically
4. Connect your wallet (Base network)
5. Click "🚀 Mint NFT" to create the NFT
6. Sign the transaction in your wallet
7. Wait for confirmation and view on BaseScan

## 4. OpenSea Integration

Your NFTs will automatically appear on OpenSea because:
- They follow ERC721 standard
- They have proper metadata
- They're deployed on Base (supported by OpenSea)
- Token URI points to Walrus storage

View your collection at:
`https://opensea.io/assets/base/YOUR_CONTRACT_ADDRESS/TOKEN_ID`

## 5. Troubleshooting

### Contract Address Issues
- Make sure to update the contract address in NFTMinter.tsx
- Verify the contract is deployed on the correct network
- Check that your wallet is connected to Base network

### Transaction Failures
- Ensure you have enough ETH for gas fees
- Check that the Walrus blob exists and is accessible
- Verify your wallet is connected to the correct network

### OpenSea Issues
- Wait 5-10 minutes for metadata refresh
- Use OpenSea's refresh metadata feature
- Ensure your token URI returns valid JSON metadata

## 6. Gas Optimization Tips

- Batch multiple mints in one transaction (if needed)
- Use OnchainKit's transaction sponsoring for gasless experiences
- Consider implementing ERC721A for bulk minting efficiency

## 7. Next Steps

- Add royalty support (EIP-2981)
- Implement collection metadata
- Add minting limitations/pricing
- Create a gallery view for minted NFTs
- Add social sharing features
