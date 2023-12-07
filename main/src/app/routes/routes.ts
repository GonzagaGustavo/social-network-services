import { Router } from "express";
import RegisterRoute from "./register-route";
import CountryController from "../../domain/controllers/country/Country";
import UserController from "../../domain/controllers/user/User";
import AuthenticationController from "../../domain/controllers/authentication/Authentication";

export default (router: Router) => {
  const registerRoute = new RegisterRoute(router);

  registerRoute.addRoute({
    route: "/country",
    controller: new CountryController(),
  });

  registerRoute.addRoute({
    route: "/user",
    controller: new UserController(),
  });

  registerRoute.addRoute({
    route: "/authentication",
    controller: new AuthenticationController(),
  });
};
