import orm from "../../../framework/database";
import Repository, { ServerConfig } from "../../../interfaces/repository";
import Jwt from "../../entities/Jwt/jwt";

export default class JwtRepository extends Repository<Jwt> {
  protected rowToObject(row: any, objects: Jwt[]): void {
    let obj = objects.find((u) => u.id === row.j_id);
    if (!obj) {
      obj = new Jwt({
        id: row.j_id,
        expiresIn: row.j_expiresIn,
        userId: row.j_userId,
      });
      objects.push(obj);
    }
  }

  public async create(o: Jwt): Promise<Jwt> {
    const created = await orm.refreshToken.create({
      data: {
        expiresIn: o.expiresIn,
        userId: o.userId,
      },
    });

    return new Jwt(created);
  }

  public async update(o: Jwt): Promise<Jwt> {
    const updated = await orm.refreshToken.update({
      data: {
        userId: o.userId,
        expiresIn: o.expiresIn,
      },
      where: {
        id: o.id,
      },
    });

    return new Jwt(updated);
  }

  public async remove(id: number): Promise<any> {
    const deleted = await orm.refreshToken.deleteMany({
      where: {
        userId: id,
      },
    });

    return deleted;
  }

  protected getConfig(): ServerConfig<Jwt> {
    const select: ServerConfig<Jwt> = {
      table: "public.refresh_token",
      alias: "j",
      // prettier-ignore
      columns: [
            'j.id         AS j_id',
            'j.expiresIn  AS j_expiresIn',
            'j.userId     AS j_userId',
          ],
      searchColumns: [],
      joins: [],
      where: "",
      order: "id",
      orderOptions: {
        id: [],
      },
      extra: {
        columns: [],
        joins: [],
      },
    };

    const config: ServerConfig<Jwt> = {
      ...select,
    };

    return config;
  }
}
