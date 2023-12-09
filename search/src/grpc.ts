import Mali from "mali";
import path from "path";
import logger from "./logger";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
const searchProtoFile = path.join("./proto/search.proto");

const app = new Mali();

app.addService(searchProtoFile, "Search", options);

app.use(async (context: any, next: any) => {
  logger.child({ grpc: "grpc" }).info(`Receiving ${context.fullName}`);

  return next();
});

app.on("error", (error) => {
  if (!error.code) {
    logger.fatal(error);
  }
});

export default app;
