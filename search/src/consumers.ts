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

class Consumer extends ConsumerTools<UseCase> {
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

  async create(data: { user_id?: number; search: string }): Promise<void> {
    if (!data.user_id) return;

    const filter: Filter = {
      ...initialFilter,
      where: `AND s.user_id=${data.user_id} AND s.search='${data.search}'`,
    };

    const exist = await this.useCase.read(filter);

    if (exist.length === 0) {
      const created = await this.useCase.create({
        search: data.search,
        user_id: data.user_id,
      });
    }
  }
  async delete(data: { user_id?: number; id?: string }): Promise<void> {
    if (data.id && data.user_id) {
      await this.useCase.remove(data.id, data.user_id);
    }
  }
  update(call: any, callback: any): void {}
}

const consumer = new Consumer();
export default consumer;
