import { Response, response } from "express";
import { HttpRequest, ResponseObject } from "../../../interfaces/controller";
import MicroServiceController from "../../../interfaces/controller/microservice";

export default class SearchHistoryController extends MicroServiceController<{}> {
  constructor() {
    super("Search", "historySearch");
  }

  async GET(httpRequest: HttpRequest, res: Response): Promise<void> {
    const userId = httpRequest.query.userId;

    this.client.get({}, (e, newData) => {
      if (e) {
        const response = this.res.serverError(e);
        res.status(response.statusCode).send(response.body);
      } else {
        console.log(newData);
        const response = this.res.ok(newData);
        res.status(response.statusCode).send(response.body);
      }
    });
  }

  async POST(httpRequest: HttpRequest, res: Response): Promise<void> {
    const response = this.res.ok("teste");
    res.status(response.statusCode).send(response.body);
  }

  async PUT(httpRequest: HttpRequest, res: Response): Promise<void> {
    const response = this.res.ok("teste");
    res.status(response.statusCode).send(response.body);
  }

  async DELETE(httpRequest: HttpRequest, res: Response): Promise<void> {
    const response = this.res.ok("teste");
    res.status(response.statusCode).send(response.body);
  }
}
