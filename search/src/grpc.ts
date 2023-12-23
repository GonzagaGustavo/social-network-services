import path from "path";
import { loadSync } from "@grpc/proto-loader";
import { Server, loadPackageDefinition } from "@grpc/grpc-js";
import Consumer from "./consumers";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const searchProtoFile = path.join(__dirname + "/proto/search.proto");

const protoLoader = loadSync(searchProtoFile, options);
const packageDefinition: any = loadPackageDefinition(protoLoader);

const server = new Server();

const consumer: any = new Consumer();
server.addService(packageDefinition.Search.service, consumer);

export default server;
