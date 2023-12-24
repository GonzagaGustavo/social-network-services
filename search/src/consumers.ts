import { ServerUnaryCall } from "@grpc/grpc-js";
import logger from "./logger";
import ConsumerTools from "./abstract/consumer";
import UseCase from "./domain/usecase";
import SearchRepository from "./domain/repository";
import { Filter, initialFilter } from "./abstract/repository";

interface MyRequest {}
interface MyResponse {
  id: string;
  user_id: number;
  search: string;
}

export default class Consumer extends ConsumerTools<UseCase> {
  useCase: UseCase;

  constructor() {
    super();
    const repository = new SearchRepository();
    this.useCase = new UseCase(repository);
  }

  async get(call: any, callback: any): Promise<void> {
    const data = call.request;
    if (!data || !data.user_id) {
      callback(null, { error: "user_id invalido" });
      return;
    }

    const filter: Filter = {
      ...initialFilter,
      where: `AND s.user_id=${data.user_id}`,
    };
    const searchHistory = await this.useCase.read(filter);
    logger.info(searchHistory);
    callback(null, { search: searchHistory });
  }

  create(call: any, callback: any): void {}
  delete(call: any, callback: any): void {}
  update(call: any, callback: any): void {}
}
