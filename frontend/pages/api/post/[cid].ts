import makeStorageClient from "./storage/client";
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const { cid } = req.query;

    if (req.method === "GET") {
        const client = makeStorageClient()
        const ipfsRes = await client.get(cid)
        console.log(`Got a response! [${ipfsRes.status}] ${ipfsRes.statusText}`)
        if (!ipfsRes.ok) {
            throw new Error(`failed to get ${cid} - [${ipfsRes.status}] ${ipfsRes.statusText}`)
        }
        
        // unpack File objects from the response
        const files = await ipfsRes.files()
        for (const file of files) {
            console.log(`${file.cid} -- ${file.path} -- ${file.size}`)
        }

      res.status(200).json(files);
    } else {
      res.status(400).json(null);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(null);
  }
}
