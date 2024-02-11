import InvalidParamError from "../../../interfaces/errors/invalid-param";
import MissingParamError from "../../../interfaces/errors/missing-param";
import { z } from "zod";

interface VideoInput {
  id?: string;
  thumb: string;
  v1080p: string;
  v720p: string;
  v480p: string;
  v144p: string;
}

export default class Video {
  _id?: string;
  _thumb: string;
  _v1080p: string;
  _v720p: string;
  _v480p: string;
  _v144p: string;

  constructor({ id, thumb, v1080p, v720p, v480p, v144p }: VideoInput) {
    this.id = id;
    this.thumb = thumb;
    this.v1080p = v1080p;
    this.v720p = v720p;
    this.v480p = v480p;
    this.v144p = v144p;
  }

  get id(): string | undefined {
    return this._id;
  }

  set id(id: string | undefined) {
    this._id = id ? z.string().parse(id) : id;
  }

  get thumb(): string {
    return this._thumb;
  }

  set thumb(thumb: string) {
    if (!thumb) throw new MissingParamError("thumb");
    this._thumb = thumb;
  }

  get v1080p(): string {
    return this._v1080p;
  }

  set v1080p(v1080p: string) {
    if (!v1080p) throw new MissingParamError("v1080p");
    this._v1080p = v1080p;
  }

  get v720p(): string {
    return this._v720p;
  }

  set v720p(v720p: string) {
    if (!v720p) throw new MissingParamError("v720p");
    this._v720p = v720p;
  }

  get v480p(): string {
    return this._v480p;
  }

  set v480p(v480p: string) {
    if (!v480p) throw new MissingParamError("v480p");
    this._v480p = v480p;
  }

  get v144p(): string {
    return this._v144p;
  }

  set v144p(v144p: string) {
    if (!v144p) throw new MissingParamError("v144p");
    this._v144p = v144p;
  }
}
