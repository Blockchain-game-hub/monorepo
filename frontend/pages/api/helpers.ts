import jwt from "jsonwebtoken";
import { NextApiResponse } from "next";

function jwtVerify(res: NextApiResponse, authToken: string, action) {
  return new Promise<void>((resolve, reject) => {
    jwt.verify(authToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Unauthorized" });
        reject(err);
      } else {
        action(err, decoded);
        return resolve();
      }
    });
  });
}

export { jwtVerify };
