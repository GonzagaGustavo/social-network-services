export default class InvalidMethodError extends Error {
  constructor(methodName: string) {
    super("Invalid Method: " + methodName);
    this.name = "InvalidMethodError";
  }
}
