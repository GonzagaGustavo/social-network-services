import { Response } from "express";
import { HttpRequest } from "../../../../interfaces/controller";
import MicroServiceController from "../../../../interfaces/controller/microservice";
import eventType from "./eventType";

type Like = {
  user?: { id: number; email: string; username: string };
  post?: { id: string; title: string };
  user_id: number;
  post_id: string;
  created: Date;
};

export default class PostActionLike extends MicroServiceController<Like> {
  constructor() {
    super(
      { _package: "like", service: "Like" },
      {
        directory: "post/actionLike",
        file: "actionLike",
        port: "50051",
      }
    );
  }

  async GET(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    this.client.get({ user_id: "1" }, (err, data) => {
      if (err) {
        console.error(err);
        return res.send({ err });
      }

      res.send({ data });
    });
  }

  async POST(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    const playload = {
      event: "CREATE",
      user_id: 1,
    };
    const success = this.kafkaProducer.write(eventType.toBuffer(playload));

    if (success) {
      const response = this.res.ok({ success });
      res.status(response.statusCode).send(response.body);
      return;
    } else {
      const response = this.res.badRequest(
        new Error("Something went wrong...")
      );
      res.status(response.statusCode).send(response.body);
    }
  }

  async PUT(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>
  ): Promise<void> {}

  async DELETE(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>
  ): Promise<void> {}
}
