// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method === "GET") {
      const { username } = req.query;
      const user = await prisma.user.findFirst({
        where: {
          username,
        },
      });

      res.status(200).json(user);
    } else {
      res.status(400).json(null);
    }
  } catch (err) {
    res.status(500).json(null);
  }
}
