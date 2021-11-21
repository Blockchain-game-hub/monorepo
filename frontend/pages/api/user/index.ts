// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "../helpers";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    // Handle POST
  } else if (req.method === "GET") {
    const allUsers = await prisma.user.findMany();
    res.status(200).json(allUsers[0]);
  } else if (req.method === "PUT") {
    jwtVerify(res, req.headers.authorization, async (err, decoded) => {
      const user = await prisma.user.update({
        where: { id: decoded.id },
        data: {
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
        },
      });
      res.status(200).json(user);
    });
  } else {
  }
  await prisma.$disconnect();
}
