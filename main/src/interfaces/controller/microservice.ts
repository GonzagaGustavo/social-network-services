import path from "path";
import { HttpRequest, ResponseObject } from ".";
import InvalidMethodError from "../errors/invalid-method";
import UnauthorizedError from "../errors/unauthorized-error";
import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import { Response } from "express";
import { Producer, ProducerStream } from "node-rdkafka";
import protobuf from "protobufjs";

type CallBackFunction<T> = (error: any, data: T) => void;

export default abstract class MicroServiceController<T> {
  client: {
    get: (info: any, callback: CallBackFunction<T>) => void;
    create: (info: T, callback: CallBackFunction<T>) => void;
    update: (info: T, callback: CallBackFunction<T>) => void;
    delete: (info: string, callback: CallBackFunction<T>) => void;
  };
  kafkaProducer: ProducerStream;
  protoFile: string;
  kafkaMessage: protobuf.Type;

  /**
   *
   * @param serviceName
   * @param param File, directory of .proto and port of gRPC server
   */
  constructor(
    { service, _package }: { _package?: string; service: string },
    {
      file,
      directory,
      port,
      kafkaMessage: kafkaMessageName,
    }: { file: string; directory: string; port: string; kafkaMessage: string }
  ) {
    this.setProtoFile({ directory, file });
    this.setClient({ service, _package, port });
    this.setProducer({ topic: service, kafkaMessageName, _package });
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

  private async setClient({
    service,
    _package,
    port,
  }: {
    _package?: string;
    service: string;
    port: string;
  }) {
    const options = {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    };

    const protoObject = loadSync(this.protoFile, options);
    const client = loadPackageDefinition(protoObject);
    let Service: any;
    if (_package) {
      Service = client[_package][service];
    } else {
      Service = client[service];
    }

    this.client = new Service(
      `localhost:${port}`,
      credentials.createInsecure()
    );
  }

  private setProducer({
    topic,
    kafkaMessageName,
    _package,
  }: {
    topic: string;
    kafkaMessageName: string;
    _package: string;
  }) {
    this.kafkaProducer = Producer.createWriteStream(
      {
        "metadata.broker.list": "localhost:9092",
      },
      {},
      { topic }
    );
    this.kafkaProducer.connect();

    const root = protobuf.loadSync(this.protoFile);
    this.kafkaMessage = root.lookupType(
      _package ? `${_package}.${kafkaMessageName}` : kafkaMessageName
    );
  }

  private setProtoFile({
    directory,
    file,
  }: {
    file: string;
    directory: string;
  }) {
    this.protoFile = `${this.getSrcDirectory()}/domain/controllers/${directory}/${file}.proto`;
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
