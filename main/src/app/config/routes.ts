import { Router, Express } from "express";
import registerRoute from "../routes/routes";

export default (app: Express) => {
  const router = Router();
  registerRoute(router);
  app.use("/api", router);
};
