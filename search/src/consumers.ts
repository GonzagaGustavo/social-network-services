import { Call } from "@grpc/grpc-js";
import logger from "./logger";

export async function get(call: any, callback: any) {
  callback(null, {
    id: "213",
    user_id: 1,
    search: "thought that I",
  });

  // call.on("data", (data) => {
  //   logger.info("data", data);
  // });

  // call.write({
  //   id: "213",
  //   user_id: 1,
  //   search: "thought that I",
  // });

  // call.on("end", () => {
  //   logger.info("end");
  // });

  // call.end();
}
