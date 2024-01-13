import { Response } from "express";
import { HttpRequest } from "../../../../interfaces/controller";
import MicroServiceController from "../../../../interfaces/controller/microservice";

type Like = {
  user?: { id: number; email: string; username: string };
  post?: { id: string; title: string };
  user_id: number;
  post_id: string;
  created: Date;
};

export default class PostActionLike extends MicroServiceController<Like> {
  constructor() {
    super("Like", {
      directory: "post/actionLike",
      file: "actionLike.proto",
      port: "50051",
    });
  }

  async GET(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>
  ): Promise<void> {}

  async POST(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>
  ): Promise<void> {}

  async PUT(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>
  ): Promise<void> {}

  async DELETE(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>
  ): Promise<void> {}
}
