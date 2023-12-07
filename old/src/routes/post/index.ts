import { Router } from "express";
import prisma from "../../db";
import AuthGuard, { GetUser } from "../../middlewares/jwt";
import Multer from "../../middlewares/multer";
import { bucket, uploadFileToStorage } from "../../middlewares/firebase";
import { publicUser } from "../../utils/jwt";

const PostRouter = Router();

PostRouter.post(
  "/",
  AuthGuard,
  Multer.array("file", 2),
  uploadFileToStorage,
  async (req, res) => {
    if (req.fileInfos.firebaseUrl) {
      try {
        const created = await prisma.post.create({
          data: {
            file: req.fileInfos.firebaseUrl,
            title: req.body.title,
            description: req.body.description,
            type: "image",
            autor_id: req.user.id,
          },
        });
        res.status(200).json({ success: true, postId: created.id });
      } catch (err) {
        console.error(err);
        res.status(201).json({ message: err });
      }
    } else if (req.fileInfos.video) {
      try {
        const videoCreated = await prisma.video.create({
          data: {
            thumb: req.fileInfos.thumb,
            v1080p: req.fileInfos.v1080,
            v720p: req.fileInfos.v720,
            v480p: req.fileInfos.v480,
            v144p: req.fileInfos.v144,
          },
        });

        const created = await prisma.post.create({
          data: {
            title: req.body.title,
            description: req.body.description,
            type: "video",
            autor_id: req.user.id,
            video_id: videoCreated.id,
          },
        });

        res.status(200).json({ success: true, postId: created.id });
      } catch (err) {
        console.error(err);
        res.status(201).json({ message: err });
      }
    }
  }
);
PostRouter.get("/", async (req, res) => {
  const posts = await prisma.post.findMany({
    select: { video: true, autor: true, type: true, title: true, id: true },
  });

  res.json(posts);
});
PostRouter.get("/:id", GetUser, async (req, res) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(req.params.id),
    },
    select: {
      id: true,
      autor: { select: publicUser },
      video: true,
      created: true,
      type: true,
      title: true,
      description: true,
      file: true,
    },
  });

  res.status(200).json(post);
});

PostRouter.get("/video/:name", async (req, res) => {
  const range = req.headers.range;

  if (!range) res.status(400).send("Requires Range Header");

  if (!req.params.name) {
    return res.status(400).send("quality not available");
  }

  const file = bucket.file(req.params.name + ".mp4");

  const videoMetaData = await file.getMetadata();

  const videoSize = videoMetaData[0].size;

  const chunk_size = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + chunk_size, videoSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const videoStream = file.createReadStream({ start, end });

  videoStream.pipe(res);
});

export default PostRouter;
