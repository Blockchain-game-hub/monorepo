import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method === "POST") {
      let url = "https://api.nftport.xyz/v0/contracts";

      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NFTPORT_API_KEY,
        },
        body: JSON.stringify({
          chain: process.env.CHAIN,
          name: "Memberships V3",
          symbol: "MM",
          owner_address: process.env.CONTRACT_OWNER_ADDRESS,
          metadata_updatable: true,
        }),
      };

      let resp = await fetch(url, options);
      resp = await resp.json();

      res.status(200).json(resp);
    } else {
      res.status(400).json(null);
    }
  } catch (err) {
    res.status(500).json(null);
  }
}
