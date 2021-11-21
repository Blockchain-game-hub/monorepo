import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import makeStorageClient from "./storage/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    if (req.method === "GET") {
      const { id } = req.query;
      const post = await prisma.post.findFirst({
        where: {
          id: parseInt(id),
        },
      });

      let ipfsURL = "";
      const client = makeStorageClient();
      const ipfsRes = await client.get(post?.ipfsURL);
      if (ipfsRes.ok) {
        const files = await ipfsRes.files();
        const file = files[0];
        ipfsURL = `https://${file.cid}.ipfs.dweb.link`;
      }

      const userInfo = await prisma.user.findFirst({
        where: {
          id: post?.authorId,
        },
        select: {
          id: true,
          name: true,
          username: true,
          address: true,
          avatarURL: true,
        },
      });

      post?.ipfsURL = ipfsURL;

      const response = {
        ...post,
        user: userInfo,
      };

      res.status(200).json(response);
    } else {
      res.status(400).json(null);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(null);
  }
  await prisma.$disconnect();
}
