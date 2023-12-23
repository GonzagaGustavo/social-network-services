import Repository, { ServerConfig } from "src/abstract/repository";
import orm from "src/config/db";
import zod from "zod";

export const schema = zod.object({
  id: zod.string(),
  user_id: zod.number(),
  search: zod.string(),
  sort: zod.number(),
});
export const createSchema = zod.object({
  id: zod.string().optional(),
  user_id: zod.number(),
  search: zod.string(),
});

type EntityType = zod.TypeOf<typeof schema>;
type MinEntityType = zod.TypeOf<typeof createSchema>;

export default class SearchRepository extends Repository<
  EntityType,
  MinEntityType
> {
  protected rowToObject(row: any, objects: EntityType[]): void {
    let obj = objects.find((s) => s.id === row.s_id);
    if (!obj) {
      obj = schema.parse({
        id: row.s_id,
        search: row.s_search,
        sort: row.s_sort,
        user_id: row.s_user_id,
      });
      objects.push(obj);
    }
  }

  public async create(o: MinEntityType): Promise<EntityType> {
    const created = await orm.history.create({
      data: {
        search: o.search,
        user_id: o.user_id,
      },
    });

    return schema.parse(created);
  }

  public async update(o: EntityType): Promise<EntityType> {
    const updated = await orm.history.update({
      data: {
        search: o.search,
      },
      where: {
        id: o.id,
        user_id: o.user_id,
      },
    });

    return schema.parse(updated);
  }

  public async remove(id: string, user_id: number): Promise<EntityType> {
    const deleted = await orm.history.delete({
      where: {
        id: id,
        user_id: user_id,
      },
    });

    return schema.parse(deleted);
  }

  protected getConfig(): ServerConfig<EntityType> {
    const select = {
      table: "public.history",
      alias: "s",
      // prettier-ignore
      columns: [
        's.id         AS s_id', 
        's.search     AS s_search', 
        's.sort       AS s_sort',
        's.user_id    AS s_user_id'
      ],
      searchColumns: [],
      joins: [],
      where: "",
      order: "sort",
      orderOptions: {
        sort: ["s.sort DESC"],
      },
      extra: {
        columns: [],
        joins: [],
      },
    };

    const config: ServerConfig<EntityType> = {
      ...select,
    };

    return config;
  }
}
