import { Response, response } from "express";
import { HttpRequest, ResponseObject } from "../../../interfaces/controller";
import MicroServiceController from "../../../interfaces/controller/microservice";
import InvalidParamError from "../../../interfaces/errors/invalid-param";
import eventType from "./eventType";

type HandleMessage = {
  event: "CREATE" | "DELETE" | "UPDATE";
  id?: string;
  user_id?: number;
  search: string;
  sort?: number;
};

export default class SearchHistoryController extends MicroServiceController<{
  search: string;
  sort: number;
}> {
  constructor() {
    super("Search", "historySearch");
  }

  async GET(httpRequest: HttpRequest, res: Response): Promise<void> {
    const user_id = httpRequest.query.userId;

    this.client.get({ user_id }, (e, newData) => {
      if (e) {
        const response = this.res.badRequest(e);
        res.status(response.statusCode).send(response.body);
      } else {
        const response = this.res.ok(newData);
        res.status(response.statusCode).send(response.body);
      }
    });
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
      event: "CREATE",
      search: httpRequest.body.search,
      user_id: httpRequest.user.id,
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

  async PUT(httpRequest: HttpRequest, res: Response): Promise<void> {
    const response = this.res.invalidMethod("PUT");
    res.status(response.statusCode).send(response.body);
  }

  async DELETE(httpRequest: HttpRequest, res: Response): Promise<void> {
    const response = this.res.ok("teste");
    res.status(response.statusCode).send(response.body);
  }
}
