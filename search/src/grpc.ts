import path from "path";
import logger from "./logger";
import { get } from "./consumers";
import { secret_token } from "./config";
import { loadSync } from "@grpc/proto-loader";
import { Server, loadPackageDefinition } from "@grpc/grpc-js";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const searchProtoFile = path.join(__dirname + "/proto/search.proto");

const protoLoader = loadSync(searchProtoFile, options);
const packageDefinition = loadPackageDefinition(protoLoader);

const server = new Server();

server.addService(packageDefinition.Search.service, { get: get });

export default server;
