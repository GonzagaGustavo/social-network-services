export default abstract class ConsumerTools<UseCase> {
  abstract useCase: UseCase;

  /**
 * @example stream: 
 * call.on("data", (data) => {
    // data of request
  });

  call.write({
    id: "213",
    user_id: 1,
    search: "thought that I",
  });

  call.on("end", () => {
    // after response end
  });

  call.end();
 * @example json:
  callback(null, {
    id: "213",
    user_id: 1,
    search: "thought that I",
  });
 */
  abstract get(call: any, callback: any): void;

  abstract create(data: any): void;
  /**
 * @example stream: 
 * call.on("data", (data) => {
    // data of request
  });

  call.write({
    id: "213",
    user_id: 1,
    search: "thought that I",
  });

  call.on("end", () => {
    // after response end
  });

  call.end();
 * @example json:
  callback(null, {
    id: "213",
    user_id: 1,
    search: "thought that I",
  });
 */
  abstract update(call: any, callback: any): void;
  abstract delete(call: any, callback: any): void;
}
