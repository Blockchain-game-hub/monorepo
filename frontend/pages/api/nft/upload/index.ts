import { NFTStorage, File } from "nft.storage";
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { capitalizeFirstChar } from "../../../../utils/strings";

const apiKey = process.env.NFT_STORAGE_API_KEY;
const client = new NFTStorage({ token: apiKey });

/**
 * Uploads the NFT and it's metadata to IPFS and returns
 * the IPFS uri to the metadata
 * @param req
 * @param res
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    if (req.method === "POST") {
      // TODO (0xkhwarizmi): Pass Image from frontend + replace hardcoded metadata

      let type = req.body["membershipType"];

      if (!["annual", "lifetime", "monthly"].includes(type)) {
        throw Error("Invalid Membership Type");
      }

      const metadata = await client.store({
        name: "Portals",
        description: `${capitalizeFirstChar(type)} Membership`,
        image: new File(
          [await fs.promises.readFile(`public/images/${type}.png`)],
          `${type}.png`,
          { type: "image/png" }
        ),
      });

      res.status(200).json(metadata);
    } else {
      res.status(400).json(null);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(null);
  }
}
