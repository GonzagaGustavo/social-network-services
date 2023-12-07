import InvalidParamError from "../../../interfaces/errors/invalid-param";
import MissingParamError from "../../../interfaces/errors/missing-param";
import { z } from "zod";
import User from "../User/User";
import Likes from "../Likes/Likes";
import Video from "../Video/Video";

interface PostInput {
  id?: number;
  autor?: User;
  autor_id?: number;
  type: string;
  file?: string;
  title: string;
  description: string;
  deslikes?: number;
  favorites?: number;
  shares?: number;
  likes?: Likes[];
  video_id?: number;
  video?: Video;
  created?: Date;
}

export default class Post {
  _id?: number;
  _autor?: User;
  _autor_id?: number;
  _type: string;
  _file?: string;
  _title: string;
  _description: string;
  _deslikes: number = 0;
  _favorites: number = 0;
  _shares: number = 0;
  _likes: Likes[] = [];
  _video_id?: number;
  _video?: Video;
  _created?: Date;

  constructor({
    id,
    autor,
    autor_id,
    type,
    file,
    title,
    description,
    deslikes,
    favorites,
    shares,
    likes,
    video_id,
    video,
    created,
  }: PostInput) {
    this.id = id;
    this.autor = autor;
    this.autor_id = autor_id;
    this.type = type;
    this.file = file;
    this.title = title;
    this.description = description;
    this.deslikes = deslikes;
    this.favorites = favorites;
    this.shares = shares;
    this.likes = likes;
    this.video_id = video_id;
    this.video = video;
    this.created = created;
  }

  get id(): number | undefined {
    return this._id;
  }

  set id(id: number | undefined) {
    this._id = id ? z.number().parse(id) : id;
  }

  get autor(): User | undefined {
    return this._autor;
  }

  set autor(autor: User | undefined) {
    this._autor = autor;
  }

  get autor_id(): number | undefined {
    return this._autor_id;
  }

  set autor_id(autor_id: number | undefined) {
    // if (!autor_id) throw new MissingParamError("autor_id");
    this._autor_id = autor_id ? z.number().parse(autor_id) : autor_id;
  }

  get type(): string {
    return this._type;
  }

  set type(type: string) {
    if (!type) throw new MissingParamError("type");
    if (type.length > 50) throw new InvalidParamError("type");

    this._type = type;
  }

  get file(): string | undefined {
    return this._file;
  }

  set file(file: string | undefined) {
    if (file) {
      if (file.length > 150) throw new InvalidParamError("file");
    }
    this._file = file;
  }

  get title(): string {
    return this._title;
  }

  set title(title: string) {
    if (!title) throw new MissingParamError("title");
    if (title.length > 200) throw new InvalidParamError("title");

    this._title = title;
  }

  get description(): string {
    return this._description;
  }

  set description(description: string) {
    if (!description) throw new MissingParamError("description");

    this._description = description;
  }

  get deslikes(): number {
    return this._deslikes;
  }

  set deslikes(deslikes: number) {
    if (deslikes) {
      this._deslikes = deslikes;
    }
  }

  get favorites(): number {
    return this._favorites;
  }

  set favorites(favorites: number) {
    if (favorites) {
      this._favorites = favorites;
    }
  }

  get shares(): number {
    return this._shares;
  }

  set shares(shares: number) {
    if (shares) {
      this._shares = shares;
    }
  }

  get likes(): Likes[] {
    return this._likes;
  }

  set likes(likes: Likes[] | undefined) {
    if (likes) {
      this._likes = likes;
    }
  }

  get video_id(): number | undefined {
    return this._video_id;
  }

  set video_id(video_id: number | undefined) {
    this._video_id = video_id;
  }

  get video(): Video | undefined {
    return this._video;
  }

  set video(video: Video | undefined) {
    this._video = video;
  }

  get created(): Date {
    return this._created;
  }

  set created(created: Date | undefined) {
    this._created = created;
  }
}
