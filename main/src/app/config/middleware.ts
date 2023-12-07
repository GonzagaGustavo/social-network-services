import { Express } from "express";
import json from "./middleware/body-parser/json";
import formData from "./middleware/body-parser/form-data";
import cors from "./middleware/cors";
import contentType from "./middleware/content-type";
import user from "./middleware/user";

export default (app: Express) => {
  app.use(json());
  app.use(formData);
  app.use(cors);
  app.use(contentType);
  app.use(user);
};
