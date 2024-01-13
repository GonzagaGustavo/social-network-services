import { Router } from "express";
import RegisterRoute from "./register-route";
import CountryController from "../../domain/controllers/country/Country";
import UserController from "../../domain/controllers/user/User";
import AuthenticationController from "../../domain/controllers/authentication/Authentication";
import SearchHistoryController from "../../domain/controllers/historySearch/HistorySearch";
import PostActionLike from "../../domain/controllers/post/actionLike/PostActionLike";

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

  registerRoute.addRoute({
    route: "/history/search",
    controller: new SearchHistoryController(),
  });

  registerRoute.addRoute({
    route: "/post/action/like",
    controller: new PostActionLike(),
  });
};
