import { Response } from "express";
import { HttpRequest } from "../../../interfaces/controller";
import MicroServiceController from "../../../interfaces/controller/microservice";
import InvalidParamError from "../../../interfaces/errors/invalid-param";

type HandleMessage = {
  event: any;
  id?: string;
  userId?: number;
  search?: string;
  sort?: number;
};

export default class SearchHistoryController extends MicroServiceController<{
  search: string;
  sort: number;
}> {
  constructor() {
    super(
      { service: "Search" },
      {
        kafkaMessage: "Handle",
        directory: "historySearch",
        file: "historySearch",
        port: "50050",
      }
    );
  }

  async GET(httpRequest: HttpRequest, res: Response): Promise<void> {
    const user_id = httpRequest.user.id;

    if (user_id) {
      this.client.get({ user_id }, (e, newData) => {
        if (e) {
          const response = this.res.badRequest(e);
          res.status(response.statusCode).send(response.body);
        } else {
          const response = this.res.ok(newData);
          res.status(response.statusCode).send(response.body);
        }
      });
    } else {
      const response = this.res.unauthorizedError();
      res.status(response.statusCode).send(response.body);
    }
  }

  async POST(httpRequest: HttpRequest, res: Response): Promise<void> {
    if (!httpRequest.user || !httpRequest.user.id) {
      const response = this.res.unauthorizedError();
      res.status(response.statusCode).send(response.body);
      return;
    }

    if (!httpRequest.body.search) {
      const response = this.res.badRequest(new InvalidParamError("Search"));
      res.status(response.statusCode).send(response.body);
      return;
    }

    const playload: HandleMessage = {
      event: this.kafkaMessage.getEnum("Event").CREATE,
      search: httpRequest.body.search,
      userId: httpRequest.user.id,
    };
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

  async PUT(httpRequest: HttpRequest, res: Response): Promise<void> {
    const response = this.res.invalidMethod("PUT");
    res.status(response.statusCode).send(response.body);
  }

  async DELETE(httpRequest: HttpRequest, res: Response): Promise<void> {
    if (!httpRequest.user || !httpRequest.user.id) {
      const response = this.res.unauthorizedError();
      res.status(response.statusCode).send(response.body);
      return;
    }

    if (!httpRequest.params.id) {
      const response = this.res.badRequest(new InvalidParamError("Id"));
      res.status(response.statusCode).send(response.body);
      return;
    }

    const playload: HandleMessage = {
      event: this.kafkaMessage.getEnum("Event").DELETE,
      id: httpRequest.params.id,
      userId: httpRequest.user.id,
    };
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
