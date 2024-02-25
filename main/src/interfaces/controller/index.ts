import { Request, Response } from "express";
import InvalidMethodError from "../errors/invalid-method";
import UnauthorizedError from "../errors/unauthorized-error";
import { IncomingHttpHeaders } from "http";

export type ResponseObject = {
  statusCode: number;
  body: any;
};
export type HttpRequest = {
  headers: IncomingHttpHeaders;
  body: any;
  params: any;
  query: any;
  user?: { id: number; email: string; name: string } | null;
};

export default abstract class Controller<UseCase> {
  abstract useCase: UseCase;

  res = {
    /**
     * @returns statusCode 400
     */
    badRequest(error: Error): ResponseObject {
      return {
        statusCode: 400,
        body: error.toString(),
      };
    },

    /**
     * @returns statusCode 500
     */
    serverError(error: any): ResponseObject {
      return {
        statusCode: 500,
        body: error,
      };
    },

    /**
     * @returns statusCode 401
     */
    unauthorizedError(): ResponseObject {
      return {
        statusCode: 401,
        body: new UnauthorizedError(),
      };
    },

    /**
     * @returns statusCode 405
     */
    invalidMethod(method: string): ResponseObject {
      return {
        statusCode: 405,
        body: new InvalidMethodError(method),
      };
    },

    /**
     * @returns statusCode 200
     */
    ok(body: any): ResponseObject {
      return {
        statusCode: 200,
        body: body,
      };
    },

    removeUnderline(_obj: any) {
      const obj = Object.assign({}, _obj);
      const newObj = Object.keys(obj).reduce((acc: any, key) => {
        let newKey = key.replace(/^_/, "");
        let value = obj[key];

        if (typeof value === "object" && value !== null) {
          value = Object.keys(value).reduce((acc2: any, key2) => {
            let newKey2 = key2.replace(/^_/, "");
            acc2[newKey2] = value[key2];
            return acc2;
          }, {});
        }

        acc[newKey] = value;
        return acc;
      }, {});

      return newObj;
    },
  };

  abstract GET(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>,
    req: Request
  ): Promise<void>;
  abstract POST(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>,
    req: Request
  ): Promise<void>;
  abstract PUT(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>,
    req: Request
  ): Promise<void>;
  abstract DELETE(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>,
    req: Request
  ): Promise<void>;
}
