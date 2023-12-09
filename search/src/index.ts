import { port } from "./config";
import server from "./grpc";
import logger from "./logger";

async function run() {
  server.start(`0.0.0.0:${port}`);
  logger
    .child({ application: "application" })
    .info({ tag: "run" }, `Application booted on port ${port}`);
}

run();
