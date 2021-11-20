import makeStorageClient from "./storage/client";
import { getFiles } from "./storage/helpers";
import { PrismaClient } from "@prisma/client";
import middleware from "../../../middleware";
import nextConnect from "next-connect";

const prisma = new PrismaClient();
const storageClient = makeStorageClient();

const handler = nextConnect();
handler
  .use(middleware)
  .post(async (req, res) => {
    try {
      // TODO: validate req.body
      // TODO: Come up with standard request format
      const files = await getFiles(req.files.file[0].path);
      const cid = await storageClient.put(files);
      const post = await prisma.post.create({
        data: {
          authorId: parseInt(req.body.authorId),
          ipfsURL: cid,
          type: req.body.type[0],
          isPrivate: req.body.isPrivate[0] === "true",
          title: req.body.title[0],
          description: req.body.description[0],
        },
      });
      res.status(200).json(post);
    } catch (err) {
      console.log("test", err);
      res.status(500).json(null);
    }
  })
  .get(async (req, res) => {
    try {
      const posts = await prisma.post.findMany({
        where: {
          authorId: parseInt(req.body.authorId),
        },
      });
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
