import { hashSync } from "bcrypt";
import orm from "../../../framework/database";
import Repository, { ServerConfig } from "../../../interfaces/repository";
import User from "../../entities/User/User";
import MissingParamError from "../../../interfaces/errors/missing-param";
import InvalidParamError from "../../../interfaces/errors/invalid-param";

export default class UserRepository extends Repository<User> {
  protected rowToObject(row: any, objects: User[]): void {
    let obj = objects.find((u) => u.id === +row.c_id);
    if (!obj) {
      obj = new User({
        id: +row.u_id,
        name: row.u_name,
        username: row.u_username,
        email: row.u_email,
        password: row.u_password,
        bio: row.u_bio,
        gender: row.u_gender,
        birthday: row.u_birthday,
        created: row.u_created,
      });
      objects.push(obj);
    }
  }

  public async create(o: User): Promise<User> {
    if (!o.password) throw new MissingParamError("password");
    if (!o.email) throw new MissingParamError("email");
    if (!o.birthday) throw new MissingParamError("birthday");
    if (o.password.length < 8) throw new InvalidParamError("password");

    const created = await orm.user.create({
      data: {
        username: o.username,
        name: o.name,
        email: o.email,
        birthday: o.birthday,
        gender: o.gender,
        bio: o.bio,
        city: o.city,
        country: o.country,
        estate: o.estate,
        phone: o.phone,
        password: hashSync(o.password, 12),
      },
    });

    return new User(created);
  }

  public async update(o: User): Promise<User> {
    const updated = await orm.user.update({
      data: {
        username: o.username,
        name: o.name,
        email: o.email,
        birthday: o.birthday,
        gender: o.gender,
        bio: o.bio,
        city: o.city,
        country: o.country,
        estate: o.estate,
        phone: o.phone,
        created: o.created,
        password: o.password,
      },
      where: {
        id: o.id,
      },
    });

    return new User(updated);
  }

  public async remove(id: number): Promise<User> {
    const deleted = await orm.user.delete({
      where: {
        id: id,
      },
    });

    return new User(deleted);
  }

  protected getConfig(): ServerConfig<User> {
    const select: ServerConfig<User> = {
      table: "public.user",
      alias: "u",
      // prettier-ignore
      columns: [
        'u.id         AS u_id',
        'u.username   AS u_username',
        'u.name       AS u_name',
        'u.email      AS u_email',
        'u.password   AS u_password',
        'u.bio        AS u_bio',
        'u.gender     AS u_gender',
        'u.birthday   AS u_birthday',
        'u.created    AS u_created',
      ],
      searchColumns: ["u.id", "u.name", "u.username", "u.email"],
      joins: [],
      where: "",
      order: "id",
      orderOptions: {
        id: [],
        name: ["u.name"],
        username: ["u.username", "u.name"],
        email: ["u.email"],
      },
      extra: {
        columns: [],
        joins: [],
      },
    };

    const config: ServerConfig<User> = {
      ...select,
    };

    return config;
  }
}
