import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../secret/social-network-firebase-adminsdk.json";
import { NextFunction, Request, Response } from "express";
import sharp from "sharp";
import processVideo from "../utils/video";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  storageBucket: process.env.BUCKET,
});

export const bucket = admin.storage().bucket();

async function processImage(
  file: Express.Multer.File,
  croppedArea: { height: number; width: number; x: number; y: number }
) {
  const process = sharp(file.buffer);

  const metadata = await process.metadata();

  return await process
    .extract({
      height: Math.round((croppedArea.height / 100) * metadata.height),
      width: Math.round((croppedArea.width / 100) * metadata.width),
      left: Math.round((croppedArea.x / 100) * metadata.width),
      top: Math.round((croppedArea.y / 100) * metadata.height),
    })
    .toFormat("webp")
    .toBuffer();
}

async function uploadImageToStorage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const fileBuffer = await processImage(
    req.files[0],
    JSON.parse(req.body.croppedArea)
  );

  const fileName = Date.now() + "." + "webp";

  const file = bucket.file(fileName);

  const stream = file.createWriteStream({
    metadata: {
      contentType: "image/webp",
    },
  });

  stream.on("error", (err) => {
    console.error(err);
    res.status(201).json({ message: err });
  });

  stream.on("finish", async () => {
    await file.makePublic();

    req.fileInfos.firebaseUrl = `https://storage.googleapis.com/${process.env.BUCKET}/${fileName}`;

    next();
  });

  stream.end(fileBuffer);
}

async function uploadThumbToStorage(
  thumb: Express.Multer.File
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const fileBuffer = await sharp(thumb.buffer).toFormat("webp").toBuffer();

    const fileName = Date.now() + "." + "webp";

    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: "image/webp",
      },
      resumable: false,
    });

    stream.on("error", (err) => {
      console.error(err);
      reject(err);
    });

    stream.on("finish", async () => {
      await file.makePublic();

      resolve(
        `https://storage.googleapis.com/${process.env.BUCKET}/${fileName}`
      );
    });

    stream.end(fileBuffer);
  });
}

async function uploadVideoToStorage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const videosUploaded = await processVideo(req.files[0]);

  const thumb = await uploadThumbToStorage(req.files[1]);

  req.fileInfos = { ...videosUploaded, thumb, firebaseUrl: null, video: true };

  next();
}

export async function uploadFileToStorage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const file = req.files[0];
  if (!req.body.title && !req.body.description && !file)
    res.status(201).json({ message: "Invalid options" });

  if (file.mimetype.substring(0, 5) === "image") {
    await uploadImageToStorage(req, res, next);
  } else {
    await uploadVideoToStorage(req, res, next);
  }
}
