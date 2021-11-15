### 1 - Uploading NFT + Metadata to IPFS

`POST` to `/api/nft/upload` to upload NFT asset + metadata to IPFS

**Request Body**

```json
{
  "membershipType": "lifetime" | "annual" | "monthly"
}
```

### 2 - Minting NFT

`POST` to `/api/nft/mint` with the IPFS metadata URI from (1) to mint the NFT

**Request Body**

```json
{
  "metadataURI": "ipfs://..."
}
```

See examples of minted NFTS on [Opensea](https://opensea.io/collection/memberships-v0)
