import { Request, Response } from "express";
import Controller, { HttpRequest } from "../../../interfaces/controller";
import PostUseCase from "../../usecases/Post/post.usecase";
import VideoUseCase from "../../usecases/Video/video.usecase";

export default class PostController extends Controller<PostUseCase> {
  useCase: PostUseCase;
  videoUseCase: VideoUseCase;

  constructor() {
    super();
    this.videoUseCase = new VideoUseCase();
  }

  async GET(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    const r = this.res.invalidMethod("GET");
    res.status(r.statusCode).send(r.body);
  }
  async POST(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    const r = this.res.invalidMethod("POST");
    res.status(r.statusCode).send(r.body);
  }
  async PUT(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>,
    req: Request
  ): Promise<void> {
    await this.videoUseCase.create(req, () => {
      console.log("bb");
      res.send("a");
    });
  }
  async DELETE(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    const r = this.res.invalidMethod("DELETE");
    res.status(r.statusCode).send(r.body);
  }
}
