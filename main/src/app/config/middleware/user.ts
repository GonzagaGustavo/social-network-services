import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type UserPlayload = {
  id: number;
  email: string;
  name: string;
};

const user = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization;

  if (authToken) {
    const [_, token] = authToken.split(" ");

    try {
      const user = jwt.verify(token, process.env.AUTH_SECRET!);

      req.user = user as UserPlayload;

      return next();
    } catch (err) {
      console.error(err);
      req.user = null;
      return next();
    }
  } else {
    req.user = null;
    return next();
  }
};
export default user;
