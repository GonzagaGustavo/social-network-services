import logger from "@/logger";
import { Filter, ServerConfig } from ".";

type SelectInput = {
  table: string;
  alias: string;
  columns: string;
  joins: string;
  where: string;
  order: string;
  limit: number;
  offset: number;
};

export default class SqlBuilder<Entity> {
  private _select({
    table,
    alias,
    columns,
    joins,
    where,
    order,
    limit,
    offset,
  }: SelectInput) {
    const SQL = `
      SELECT
        ${columns}
      FROM (
        SELECT DISTINCT ON (${order.replace("DESC", "")}) ${alias}.*
        FROM ${table} ${alias}
        ${joins}
        WHERE ${where}
        ORDER BY ${order}
        LIMIT ${limit} OFFSET ${offset}
      ) ${alias}
      ${joins}
      ORDER BY ${order}
    `;
    return SQL;
  }

  paginate(config: ServerConfig<Entity>, filter: Filter) {
    logger.info({ filter });
    const LIMIT = filter.limit;
    const OFFSET = LIMIT * (filter.page - 1);
    const CONFIG_WHERE = config.where ? config.where : "true";
    const FILTER_WHERE = filter.where ? filter.where : "";
    const WHERE = `CONCAT_WS(' ', ${config.searchColumns.join(
      ","
    )}) ILIKE ALL (string_to_array('${filter.search
      .split(" ")
      .map((s) => `%${s}%`) // SQL Injection Alert!
      .join(",")}', ',')) ${FILTER_WHERE} AND ${CONFIG_WHERE}`;

    const COLUMNS = config.columns.join(",");
    const JOINS = config.joins.join(" ");

    const TABLE = config.table;
    const ALIAS = config.alias;

    // order
    const hasFilterOrderKey = !!filter.order;
    const orderKey = hasFilterOrderKey
      ? filter.order
      : Object.keys(config.orderOptions)[0];
    const orderOption = config.orderOptions[orderKey];
    orderOption.push(`${config.alias}.id`); // adiciona o id sempre para evitar que agrupe por valor iguais de outras colunas

    if (hasFilterOrderKey) {
      const firstIsAsc = !orderOption[0].includes(" DESC");
      const filterIsAsc = !filter.desc;
      if (firstIsAsc && !filterIsAsc) {
        orderOption[0] += " DESC";
      }
      if (!firstIsAsc && filterIsAsc) {
        orderOption[0] = orderOption[0].replace(" DESC", "");
      }
    }
    const ORDER = orderOption.join(",");

    return this._select({
      table: TABLE,
      alias: ALIAS,
      columns: COLUMNS,
      joins: JOINS,
      where: WHERE,
      order: ORDER,
      limit: LIMIT,
      offset: OFFSET,
    });
  }

  getById(config: ServerConfig<Entity>, id: number | string) {
    const safeId = id;
    const limit = 1;
    const offset = 0;
    const where = `${config.alias}.id=${safeId}`;

    const columns = [...config.columns, ...config.extra.columns].join(", ");
    const joins = [...config.joins, ...config.extra.joins].join(" ");

    const order = `${config.alias}.id`;
    const table = config.table;
    const alias = config.alias;

    return this._select({
      table,
      alias,
      columns,
      joins,
      where,
      order,
      limit,
      offset,
    });
  }
}
