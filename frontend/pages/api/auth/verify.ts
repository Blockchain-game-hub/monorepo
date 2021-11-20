import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address, signature, nonce } = req.query;
  const decodedAddress = ethers.utils.verifyMessage(nonce, signature);
  if (address === decodedAddress) {
    const updateUser = await prisma.user.update({
      where: {
        address: `${address}`,
      },
      data: {
        nonce: Math.floor(Math.random() * 1000000000),
      },
    });
    const token = jwt.sign(
      {
        id: updateUser.id,
      },
      process.env.JWT_SECRET,
      // 1 Year = 8760 hours
      { expiresIn: "8760h" }
    );
    res.status(200).json({
      id: updateUser.id,
      address: updateUser.address,
      name: updateUser.name,
      email: updateUser.email,
      username: updateUser.username,
      token,
    });
  } else {
    res.status(401).json({ message: "Invalid signature" });
  }
}
