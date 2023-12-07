import { Request, Response } from "express";
import { HttpRequest, ResponseObject } from "../../interfaces/controller";

type RouteFunction = (httpRequest: HttpRequest) => Promise<ResponseObject>;

export default function adaptRoute(routeFunction: RouteFunction) {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      query: req.query,
      user: req.user,
    };
    const response = await routeFunction(httpRequest);

    res.status(response.statusCode).json(response.body);
  };
}
