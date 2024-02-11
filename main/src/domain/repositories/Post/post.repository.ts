import orm from "../../../framework/database";
import Repository, { ServerConfig } from "../../../interfaces/repository";
import Post from "../../entities/Post/Post";
import User from "../../entities/User/User";
import Video from "../../entities/Video/Video";

export default class PostRepository extends Repository<Post> {
  protected rowToObject(row: any, objects: Post[]): void {
    let obj = objects.find((u) => u.id === row.c_id);
    if (!obj) {
      obj = new Post({
        id: row.p_id,
        autor: new User({
          name: row.u_name,
          username: row.u_username,
          bio: row.u_bio,
          created: row.u_created,
        }),
        file: row.p_file,
        type: row.p_type,
        title: row.p_title,
        description: row.p_description,
        deslikes: row.p_deslikes,
        shares: row.p_shares,
        video_id: row.v_id,
        video: new Video({
          id: row.v_id,
          thumb: row.v_thumb,
          v1080p: row.v_v1080p,
          v720p: row.v_v720p,
          v480p: row.v_v480p,
          v144p: row.v_v144p,
        }),
        created: row.p_created,
      });
      objects.push(obj);
    }
  }

  public async create(o: Post): Promise<Post> {
    const created = await orm.post.create({
      data: {
        autor_id: o.autor_id,
        file: o.file,
        title: o.title,
        description: o.description,
        type: o.type,
        video_id: o.video_id,
      },
      select: {
        id: true,
        autor_id: true,
        type: true,
        file: true,
        title: true,
        description: true,
        created: true,
        favorites: true,
        deslikes: true,
        shares: true,
        video_id: true,
        video: true,
        autor: {
          select: {
            username: true,
            name: true,
            bio: true,
          },
        },
      },
    });

    return new Post({
      ...created,
      autor: new User(created.autor),
      video: new Video(created.video),
    });
  }

  public async update(o: Post): Promise<Post> {
    const updated = await orm.post.update({
      data: {
        file: o.file,
        title: o.title,
        description: o.description,
        type: o.type,
        deslikes: o.deslikes,
        shares: o.shares,
      },
      where: {
        id: o.id,
      },
    });

    return new Post(updated);
  }

  public async remove(id: string): Promise<Post> {
    const deleted = await orm.post.delete({
      where: {
        id: id,
      },
    });

    return new Post(deleted);
  }

  protected getConfig(): ServerConfig<Post> {
    const select = {
      table: "post",
      alias: "p",
      // prettier-ignore
      columns: [
        'p.id          AS p_id',
        'p.type        AS p_type',
        'p.file        AS p_file',
        'p.title       AS p_title',
        'p.description AS p_description',
        'p.favorites   AS p_favorites',
        'p.deslikes    AS p_deslikes',
        'p.shares      AS p_shares',
        'p.created     AS p_created',

        'v.id          AS v_id',
        'v.thumb       AS v_thumb',
        'v.v1080p      AS v_v1080p',
        'v.v720p       AS v_v720p',
        'v.v480p       AS v_v480p',
        'v.v144p       AS v_v144p',

        'u.name        AS u_name',
        'u.username    AS u_username',
        'u.bio         AS u_bio',
        'u.created     AS u_created',
      ],
      searchColumns: ["p.id", "p.title"],
      joins: [
        "LEFT JOIN public.user u ON u.id = p.autor_id",
        "LEFT JOIN public.video v ON v.id = p.video_id",
      ],
      where: "",
      order: "sort",
      orderOptions: {
        sort: ["p.sort DESC"],
        id: [],
        name: ["p.name"],
        abbr: ["p.abbr"],
      },
      extra: {
        columns: [],
        joins: [],
      },
    };

    const config: ServerConfig<Post> = {
      ...select,
    };

    return config;
  }
}
