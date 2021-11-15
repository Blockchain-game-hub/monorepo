import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    if (req.method === "POST") {
      let metadataURI = req.body["metadataURI"];

      if (!metadataURI.includes("ipfs://")) {
        throw Error("Invalid Metadata URI");
      }

      let url = "https://api.nftport.xyz/v0/mints/customizable";

      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NFTPORT_API_KEY,
        },
        body: JSON.stringify({
          chain: process.env.CHAIN,
          contract_address: process.env.NFT_CONTRACT_ADDRESS,
          metadata_uri: metadataURI,
          mint_to_address: process.env.CONTRACT_OWNER_ADDRESS, // TODO (0xkhwarizmi): Change this to user's address
        }),
      };

      let resp = await fetch(url, options);
      resp = await resp.json();

      res.status(200).json(resp);
    } else {
      res.status(400).json(null);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(null);
  }
}
