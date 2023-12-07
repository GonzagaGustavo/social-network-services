import { spawn } from "node:child_process";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import path from "node:path";
import { writeFile } from "node:fs/promises";
import * as fs from "node:fs";
import { bucket } from "../middlewares/firebase";
import * as tmp from "tmp";
import { GetUser } from "../middlewares/jwt";
import { v4 as uuid } from "uuid";

export default class Video {
  constructor(video: Express.Multer.File, userToken: string) {
    const user = GetUser(userToken);
    const roomId = `${user.id}-${uuid()}`;
  }

  async processVideo(file: Express.Multer.File): Promise<{
    v1080: string | null;
    v720: string | null;
    v480: string | null;
    v144: string | null;
  }> {
    let videos;

    const tempFilePath = tmp.tmpNameSync({
      postfix: path.extname(file.originalname),
    });
    await writeFile(tempFilePath, file.buffer);

    const resolution = await this.getResolution(tempFilePath);
    console.log("generating videos...");

    if (resolution >= 1080) {
      const v1080Promise = this.changeVideoQualityAndUpload(tempFilePath, 1080);
      const v720Promise = this.changeVideoQualityAndUpload(tempFilePath, 720);
      const v480Promise = this.changeVideoQualityAndUpload(tempFilePath, 480);
      const v144Promise = this.changeVideoQualityAndUpload(tempFilePath, 144);

      const [v1080, v720, v480, v144] = await Promise.all([
        v1080Promise,
        v720Promise,
        v480Promise,
        v144Promise,
      ]);

      videos = {
        v1080,
        v720,
        v480,
        v144,
      };
    } else if (resolution < 1080 && resolution >= 720) {
      const v720Promise = this.changeVideoQualityAndUpload(tempFilePath, 720);
      const v480Promise = this.changeVideoQualityAndUpload(tempFilePath, 480);
      const v144Promise = this.changeVideoQualityAndUpload(tempFilePath, 144);

      const [v720, v480, v144] = await Promise.all([
        v720Promise,
        v480Promise,
        v144Promise,
      ]);

      console.log("finish generating videos");

      videos = {
        v1080: null,
        v720,
        v480,
        v144,
      };
    } else if (resolution < 720 && resolution >= 480) {
      const v480Promise = this.changeVideoQualityAndUpload(tempFilePath, 480);
      const v144Promise = this.changeVideoQualityAndUpload(tempFilePath, 144);

      const [v480, v144] = await Promise.all([v480Promise, v144Promise]);

      videos = {
        v1080: null,
        v720: null,
        v480,
        v144,
      };
    } else if (resolution < 480 && resolution >= 144) {
      const v144 = await this.changeVideoQualityAndUpload(tempFilePath, 144);

      videos = {
        v144: v144,
        v1080: null,
        v480: null,
        v720: null,
      };
    }

    fs.unlinkSync(tempFilePath);

    return videos;
  }

  getResolution(path: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const video = spawn(ffmpegPath, ["-i", `${path}`]);

      video.stderr.on("data", (data) => {
        const match = data.toString().match(/Stream.*Video:.*\s(\d+)x(\d+)/);

        if (match && match[2]) resolve(Number(match[2]));
      });

      video.stderr.on("error", (err) => reject(err));
    });
  }

  private changeVideoQualityAndUpload(
    filePath: string,
    quality: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const tempFilePath = tmp.tmpNameSync({
        postfix: path.extname(`${quality}-` + filePath),
      });
      const fileName = Date.now() + `-${quality}.mp4`;

      const ffmpeg = spawn(ffmpegPath, [
        `-i`,
        `${filePath}`,
        "-vcodec",
        "libx264",
        "-b:v",
        "200k",
        "-c:a",
        "aac",
        "-vf",
        `scale=-2:${quality}`,
        "-f",
        "mp4",
        `${tempFilePath}`,
      ]);

      //   ffmpeg.stderr.on("data", (data) => console.log(data.toString()));

      ffmpeg.on("close", (code) => {
        if (code === 0) {
          const file = bucket.file(fileName);

          fs.createReadStream(tempFilePath)
            .pipe(
              file.createWriteStream({
                metadata: {
                  contentType: "video/mp4",
                },
                resumable: false,
              })
            )
            .on("finish", async () => {
              fs.unlinkSync(tempFilePath);

              await file.makePublic();

              resolve(
                `https://storage.googleapis.com/${process.env.BUCKET}/${fileName}`
              );
            })
            .on("error", (error) => {
              console.error(
                "Erro ao enviar o arquivo para o Firebase Storage:",
                error
              );
              reject(error);
            });
        } else {
          console.error("Erro durante o processamento do vídeo");
        }
      });
    });
  }
}
