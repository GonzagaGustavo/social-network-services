import orm, { serializeSql } from "@/config/db";
import SqlBuilder from "./sqlBuilder";
import logger from "@/logger";

export type Filter = {
  page: number;
  search: string;
  order: string;
  desc: boolean;
  more: boolean;
  limit: number;
  company?: number;
  where?: string;
};

export const initialFilter: Filter = {
  page: 1,
  search: "",
  order: "",
  limit: 8,
  desc: false,
  more: false,
};

export type ServerConfig<T> = {
  table: string; // ok
  alias: string; // ok
  columns: any[]; // ok
  searchColumns: string[]; // ok
  joins: string[]; // ok
  where: string;
  order: any; // ok
  orderOptions: any;
  extra: {
    columns: string[];
    joins: string[];
  };
};

export default abstract class Repository<Entity, MinEntity> {
  protected sqlBuilder: SqlBuilder<Entity>;

  protected abstract getConfig(): ServerConfig<Entity>;
  protected abstract rowToObject(row: any, objects: Entity[]): void;

  public abstract create(o: MinEntity): Promise<Entity>;
  public abstract update(o: Entity): Promise<Entity>;
  public abstract remove(id: number | string, user_id: number): Promise<Entity>;

  public constructor() {
    this.sqlBuilder = new SqlBuilder();
  }

  public async paginate(filter: Filter): Promise<Entity[]> {
    logger.info("AbstractService paginate()", filter);
    const config = this.getConfig();

    const sql = this.sqlBuilder.paginate(config, filter);
    logger.info(sql);

    const rows = await orm.$queryRawUnsafe<any>(sql);
    const objects = this._rowsToObjects(rows);
    return objects;
  }

  public async getById(id: number | string): Promise<Entity> {
    logger.info("AbstractRepository getById()", id);
    const config = this.getConfig();

    const sql = this.sqlBuilder.getById(config, id);
    logger.info(sql);

    const rows = await orm.$queryRaw<any>(serializeSql(sql), []);
    return this._rowsToObjects(rows)[0];
  }

  public async sort(ids: number[]) {
    logger.info("AbstractRepository sort()", ids);
    const config = this.getConfig();
    const { table } = config;
    let sort = ids.length;
    const commands: any = [];
    ids.forEach((id) => {
      commands.push(`UPDATE ${table} SET sort=${+sort} WHERE id=${+id}`);
      sort--;
    });
    const SQL = commands.join(";");
    const serializedSQL = serializeSql(SQL);
    await orm.$executeRaw(serializedSQL);
  }

  private _rowsToObjects(rows: any[]) {
    const objects: any = [];

    rows.forEach((row) => {
      this.rowToObject(row, objects);
    });

    return objects;
  }
}
