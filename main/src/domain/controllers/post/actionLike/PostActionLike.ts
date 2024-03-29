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
    super(
      { _package: "like", service: "Like" },
      {
        directory: "post/actionLike",
        file: "actionLike",
        port: "50051",
        kafkaMessage: "Handle",
      }
    );
  }

  async GET(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    this.client.get({ user_id: httpRequest.user.id }, (err, data) => {
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
    const enumMessage = this.kafkaMessage.getEnum("Event").Create;
    const playload = {
      event: enumMessage,
      id: httpRequest.body.id,
      userId: httpRequest.user.id,
    };
    const errMessage = this.kafkaMessage.verify(playload);
    if (errMessage) throw new Error(errMessage);

    const protobufObject = this.kafkaMessage.create(playload);
    const buffer = this.kafkaMessage.encode(protobufObject).finish();

    const success = this.kafkaProducer.write(buffer);

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
  ): Promise<void> {
    const enumMessage = this.kafkaMessage.getEnum("Event").Delete;
    const playload = {
      event: enumMessage,
      id: httpRequest.query.id,
      userId: httpRequest.user.id,
    };
    const errMessage = this.kafkaMessage.verify(playload);
    if (errMessage) throw new Error(errMessage);

    const protobufObject = this.kafkaMessage.create(playload);
    const buffer = this.kafkaMessage.encode(protobufObject).finish();

    const success = this.kafkaProducer.write(buffer);

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
}
