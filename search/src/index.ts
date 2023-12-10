import { ServerCredentials } from "@grpc/grpc-js";
import { port } from "./config";
import server from "./grpc";
import logger from "./logger";
import dotenv from "dotenv";

async function run() {
  dotenv.config();

  server.bindAsync(
    `0.0.0.0:${port}`,
    ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
  logger
    .child({ application: "application" })
    .info({ tag: "run" }, `Application booted on port ${port}`);
}

run();
