import { CreateSearchInput, ReadSearchInput } from "./dto";
import SearchRepository, { createSchema } from "./repository";
import zod from "zod";

export default class UseCase {
  repository: SearchRepository;

  constructor(repository: SearchRepository) {
    this.repository = repository;
  }

  async create(input: CreateSearchInput) {
    const parsedInput = createSchema.parse(input);
    return await this.repository.create(parsedInput);
  }

  async read(input: ReadSearchInput) {
    const history = await this.repository.paginate(input);
    const schema = zod.object({
      id: zod.string(),
      search: zod.string(),
      sort: zod.number(),
    });

    return history.map((search) => schema.parse(search));
  }

  async remove(id: string, user_id: number) {
    return await this.repository.remove(id, user_id);
  }
}
