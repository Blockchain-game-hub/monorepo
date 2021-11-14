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
  if (req.method === "POST") {
    // Handle POST
  } else if (req.method === "GET") {
    const allUsers = await prisma.user.findMany();
    res.status(200).json(allUsers[0]);
  } else {
  }
}
