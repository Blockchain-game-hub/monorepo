import makeStorageClient from "../post/storage/client";
import type { NextApiRequest, NextApiResponse } from "next";

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
        if (files.length > 1) {
          res.status(200).json(files);
        } else if (files.length === 1) {
          const file = files[0]
          res.status(200).json(file.cid);
        } else {
          res.status(204).json({});
        }

    } else {
      res.status(400).json(null);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(null);
  }
}
