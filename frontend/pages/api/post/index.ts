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

        let data = {
          authorId: decoded.id,
          ipfsURL: cid,
          type: req.body.type[0],
          isPrivate: req.body.isPrivate[0] === "true",
          title: req.body.title[0],
          description: req.body.description[0],
        };

        if (req.body.type[0] === "VIDEO" && req?.body?.duration) {
          console.log("video, ", req?.body?.duration);

          data = {
            ...data,
            duration: req?.body?.duration ? req?.body?.duration[0] : "00:00:05",
          };
        }

        const post = await prisma.post.create({
          data,
        });

        res.status(200).json(post);
        await prisma.$disconnect();
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(null);
    }
  })
  .get(async (req, res) => {
    try {
      const posts = await prisma.post.findMany({
        include: {
          author: true,
        },
      });

      let response = [];

      posts.forEach((post, idx) => {
        let user = post?.author;
        delete post?.author;

        response.push({
          ...post,
          author: user?.name,
          username: user?.username,
        });
      });

      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(500).json(null);
    }
    await prisma.$disconnect();
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
