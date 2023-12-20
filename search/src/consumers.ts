import { ServerUnaryCall } from "@grpc/grpc-js";
import logger from "./logger";

interface MyRequest {}
interface MyResponse {
  id: string;
  user_id: number;
  search: string;
}

export async function get(
  call: ServerUnaryCall<MyRequest, MyResponse>,
  callback: any
) {
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
