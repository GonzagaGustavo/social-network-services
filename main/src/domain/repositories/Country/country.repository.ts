import orm from "../../../framework/database";
import Repository, { ServerConfig } from "../../../interfaces/repository";
import Country from "../../entities/Country/Country";

export default class CountryRepository extends Repository<Country> {
  protected rowToObject(row: any, objects: Country[]): void {
    let obj = objects.find((u) => u.id === +row.c_id);
    if (!obj) {
      obj = new Country({ id: +row.c_id, name: row.c_name, abbr: row.c_abbr });
      objects.push(obj);
    }
  }

  public async create(o: Country): Promise<Country> {
    const created = await orm.country.create({
      data: {
        name: o.name,
        abbr: o.abbr,
      },
    });

    return new Country(created);
  }

  public async update(o: Country): Promise<Country> {
    const updated = await orm.country.update({
      data: {
        name: o.name,
        abbr: o.abbr,
        sort: o.sort,
        created: o.created,
      },
      where: {
        id: o.id,
      },
    });

    return new Country(updated);
  }

  public async remove(id: number): Promise<Country> {
    const deleted = await orm.country.delete({
      where: {
        id: id,
      },
    });

    return new Country(deleted);
  }

  protected getConfig(): ServerConfig<Country> {
    const select = {
      table: "country",
      alias: "c",
      // prettier-ignore
      columns: [
        'c.id         AS c_id', 
        'c.name       AS c_name', 
        'c.abbr       AS c_abbr',
      ],
      searchColumns: ["c.id", "c.name", "c.abbr"],
      joins: [],
      where: "",
      order: "sort",
      orderOptions: {
        sort: ["c.sort DESC"],
        id: [],
        name: ["c.name"],
        abbr: ["c.abbr"],
      },
      extra: {
        columns: [],
        joins: [],
      },
    };

    const config: ServerConfig<Country> = {
      ...select,
    };

    return config;
  }
}
