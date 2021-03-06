// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    if (req.method === "GET") {
      const { address } = req.query;
      const user = await prisma.user.findFirst({
        where: {
          address,
        },
      });

      console.log(user);
      const posts = await prisma.post.findMany({
        where: {
          authorId: user?.id,
        },
      });

      const formattedPosts = posts.map((post) => ({
        ...post,
        author: user?.name || "",
        username: user?.username || "",
        address: user?.address || "",
        publishedAt: post?.createdAt,
        isPrivate: post?.isPrivate,
        avatarURL: user?.avatarURL,
        uuid: post?.id,
      }));

      const response = {
        user,
        posts: formattedPosts,
      };

      res.status(200).json(response);
    } else {
      res.status(400).json(null);
    }
  } catch (err) {
    res.status(500).json(null);
  }
  await prisma.$disconnect();
}
