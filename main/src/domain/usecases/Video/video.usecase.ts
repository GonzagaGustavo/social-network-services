import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { IncomingHttpHeaders } from "node:http";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import path from "node:path";
import internal from "node:stream";
import { pipeline } from "node:stream/promises";
import { tmpNameSync } from "tmp";
import busboy from "busboy";
import { Request } from "express";
import { unlink } from "node:fs/promises";

export default class VideoUseCase {
  async create(req: Request, finish: () => void) {
    this.registerEvents(req, finish);
  }

  private registerEvents(req: Request, finish: () => void) {
    const busboyHandler = busboy({ headers: req.headers });

    busboyHandler.on("file", this.onFile.bind(this));
    busboyHandler.on("error", (err) => console.error(err));
    busboyHandler.on("finish", finish);

    req.pipe(busboyHandler);
  }

  private async onFile(
    name: string,
    stream: internal.Readable,
    info: busboy.FileInfo
  ) {
    console.log("oi");
    const tempPathToSave = tmpNameSync({
      postfix: path.extname(info.filename),
    });
    console.log(tempPathToSave);
    await pipeline(
      stream,
      this.handleFileBytes.apply(this),
      createWriteStream(tempPathToSave)
    );

    await this.proccess(tempPathToSave, 240);
    console.log("saindo no proccess");
  }

  private handleFileBytes() {
    async function* handleData(data) {
      let totalSize = 0;
      for await (const item of data) {
        const size = item.length;
        totalSize += size;

        // this.io.to(this.socketId).emit("file-handler", totalSize);
        console.log(totalSize);
        yield item;
      }
      console.log(totalSize);
    }

    return handleData.bind(this);
  }

  proccess(tempFilePath: string, resolutionHeight: number) {
    return new Promise((resolve, reject) => {
      // working but without pipe you must create a temporary file, read it and delete
      const ffmpegProccess = spawn(ffmpegPath, [
        `-i`,
        `${tempFilePath}`,
        "-c:v",
        "libvpx",
        "-b:v",
        "200k",
        "-c:a",
        "libvorbis",
        "-vf",
        `scale=-2:${resolutionHeight}`,
        "-f",
        "webm",
        "pipe:0",
      ]);
      // unlink(tempFilePath);
    });
  }
}
