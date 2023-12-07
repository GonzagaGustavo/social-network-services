import { Request, Response, Router } from "express";
import Controller, { HttpRequest } from "../../interfaces/controller";
import multer from "multer";

type Params = {
  get?: object | null;
} | null;

type RegisterRouteInput = {
  route: string;
  params?: Params;
  controller: Controller<any>;
};
// (httpRequest: HttpRequest) => Promise<ResponseObject>;

type RouteFunction = {
  routeFunctionName: string;
  controller: Controller<any>;
};

export default class RegisterRoute {
  router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  addRoute({ controller, params, route }: RegisterRouteInput) {
    this.router.get(
      `${route}`,
      this.adaptRoute({ routeFunctionName: "GET", controller })
    );
    this.router.post(
      `${route}`,
      multer().array("file"),
      this.adaptRoute({ routeFunctionName: "POST", controller })
    );
    this.router.put(
      `${route}`,
      this.adaptRoute({ routeFunctionName: "PUT", controller })
    );
    this.router.delete(
      `${route}/:id`,
      this.adaptRoute({ routeFunctionName: "DELETE", controller })
    );

    if (params) {
      if (params.get) {
        Object.keys(params.get).forEach((paramName) => {
          this.router.get(
            `${route}/:${paramName}`,
            this.adaptRoute({
              routeFunctionName: `${paramName}GET`,
              controller,
            })
          );
        });
      }
    }

    const controllerFunctions = Object.getOwnPropertyNames(
      Object.getPrototypeOf(controller)
    );
    const routes = controllerFunctions.filter(
      (functionName) =>
        functionName.substring(functionName.length - 5, functionName.length) ===
        "Route"
    );

    const methods = ["GET", "POST", "PUT", "DELETE"];

    routes.forEach((pRoute) => {
      const method = methods.find((word) => pRoute.indexOf(word) > -1);
      const secondRoute = pRoute.substring(0, pRoute.indexOf(method));

      if (method) {
        this.router[method.toLowerCase()](
          `${route}/${secondRoute}`,
          this.adaptRoute({
            routeFunctionName: secondRoute + method + "Route",
            controller,
          })
        );
      }
    });
  }

  private adaptRoute({ routeFunctionName, controller }: RouteFunction) {
    const _controller: any = controller;
    return async (req: Request, res: Response) => {
      const httpRequest: HttpRequest = {
        body: req.body,
        params: req.params,
        query: req.query,
        user: req.user,
      };
      const response = await _controller[routeFunctionName](httpRequest);

      res.status(response.statusCode).json(response.body);
    };
  }
}
