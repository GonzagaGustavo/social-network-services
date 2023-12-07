import MissingParamError from "../../../interfaces/errors/missing-param";
import { z } from "zod";
import Post from "../Post/Post";
import User from "../User/User";

interface LikesInput {
  id?: string;
  post?: Post;
  user?: User;
  user_id: number;
  post_id: number;
  created?: Date;
}

export default class Likes {
  _id?: string;
  _post?: Post;
  _user?: User;
  _user_id: number;
  _post_id: number;
  _created?: Date;

  constructor({ id, post, user, post_id, user_id, created }: LikesInput) {
    this.id = id;
    this.post = post;
    this.user = user;
    this.post_id = post_id;
    this.user_id = user_id;
    this.created = created;
  }

  get id(): string | undefined {
    return this._id;
  }

  set id(id: string | undefined) {
    this._id = id ? z.string().parse(id) : id;
  }

  get post_id(): number {
    return this._post_id;
  }

  set post_id(post_id: number) {
    if (!post_id) throw new MissingParamError("post_id");
    this._post_id = z.number().parse(post_id);
  }

  get user_id(): number {
    return this._user_id;
  }

  set user_id(user_id: number) {
    if (!user_id) throw new MissingParamError("user_id");
    this._user_id = z.number().parse(user_id);
  }

  get user(): User {
    return this._user;
  }

  set user(user: User | undefined) {
    this._user = user;
  }

  get post(): Post {
    return this._post;
  }

  set post(post: Post | undefined) {
    this._post = post;
  }

  get created(): Date {
    return this._created;
  }

  set created(created: Date | undefined) {
    this._created = created;
  }
}
