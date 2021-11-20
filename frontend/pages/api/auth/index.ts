import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let userInfo = await prisma.user.findUnique({
    where: {
      address: `${req.query.address}`,
    },
  });
  if (userInfo === null) {
    const newUser = await prisma.user.create({
      data: {
        address: `${req.query.address}`,
        nonce: Math.floor(Math.random() * 1000000000),
        coverPhotoURL:
          "https://i.pinimg.com/originals/d1/28/77/d12877da9adff39f7038187528d5b67a.jpg",
      },
    });
    userInfo = newUser;
  }
  res.status(200).json({ nonce: userInfo.nonce });
}
