// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const { txn_hash } = req.query;

    if (req.method === "GET") {
      let url = `https://api.nftport.xyz/v0/contracts/${txn_hash}?chain=${process.env.CHAIN}`;

      let options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NFTPORT_API_KEY,
        },
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
