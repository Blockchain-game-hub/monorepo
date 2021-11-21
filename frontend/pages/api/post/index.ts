import makeStorageClient from "./storage/client";
import { getFiles } from "./storage/helpers";

import { PrismaClient } from "@prisma/client";
import middleware from "../../../middleware";
import nextConnect from "next-connect";
import { jwtVerify } from "../helpers";

const prisma = new PrismaClient();
const storageClient = makeStorageClient();

const handler = nextConnect();

handler
  .use(middleware)
  .post(async (req, res) => {
    try {
      // TODO: validate req.body
      // TODO: Come up with standard request format
      jwtVerify(res, req.headers.authorization, async (err, decoded) => {
        const files = await getFiles(req.files.file[0].path);
        const cid = await storageClient.put(files);
        const post = await prisma.post.create({
          data: {
            authorId: decoded.id,
            ipfsURL: cid,
            type: req.body.type[0],
            isPrivate: req.body.isPrivate[0] === "true",
            title: req.body.title[0],
            duration: req?.body?.duration[0] || null,
            description: req.body.description[0],
          },
        });
        res.status(200).json(post);
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(null);
    }
  })
  .get(async (req, res) => {
    try {
      const posts = await prisma.post.findMany();
      res.status(200).json(posts);
    } catch (err) {
      console.log(err);
      res.status(500).json(null);
    }
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
