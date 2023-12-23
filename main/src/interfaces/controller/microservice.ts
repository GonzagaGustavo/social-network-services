import path from "path";
import { HttpRequest, ResponseObject } from ".";
import InvalidMethodError from "../errors/invalid-method";
import UnauthorizedError from "../errors/unauthorized-error";
import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import { Response } from "express";

type CallBackFunction<T> = (error: any, data: T) => void;

export default abstract class MicroServiceController<T> {
  client: {
    get: (info: any, callback: CallBackFunction<T>) => void;
    create: (info: T, callback: CallBackFunction<T>) => void;
    update: (info: T, callback: CallBackFunction<T>) => void;
    delete: (info: string, callback: CallBackFunction<T>) => void;
  };

  constructor(serviceName: string, fileAndDirectoryName: string) {
    this.setClient(serviceName, fileAndDirectoryName);
  }

  private getSrcDirectory() {
    let srcDirectory: string;

    if (__dirname.includes("dist")) {
      srcDirectory = path.join(__dirname, "../../../src");
    } else {
      srcDirectory = path.join(__dirname, "../..");
    }

    return srcDirectory;
  }

  private async setClient(serviceName: string, fileAndDirectoryName: string) {
    const protoFile = `${this.getSrcDirectory()}/domain/controllers/${fileAndDirectoryName}/${fileAndDirectoryName}.proto`;

    const protoObject = loadSync(protoFile);
    const client: any = loadPackageDefinition(protoObject);
    this.client = new client[serviceName](
      "localhost:50050",
      credentials.createInsecure()
    );
  }

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
    res: Response<any, Record<string, any>>
  ): Promise<void>;
  abstract POST(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>
  ): Promise<void>;
  abstract PUT(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>
  ): Promise<void>;
  abstract DELETE(
    httpRequest: HttpRequest,
    res: Response<any, Record<string, any>>
  ): Promise<void>;
}
