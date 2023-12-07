import InvalidParamError from "../../../interfaces/errors/invalid-param";
import MissingParamError from "../../../interfaces/errors/missing-param";
import { z } from "zod";

interface CountryInput {
  id?: number;
  name: string;
  abbr: string;
  sort?: number;
  created?: Date;
}

export default class Country {
  _id?: number;
  _name: string;
  _abbr: string;
  _sort?: number;
  _created?: Date;

  constructor({ id, name, abbr, sort, created }: CountryInput) {
    this.id = id;
    this.name = name;
    this.abbr = abbr;
    this.sort = sort;
    this.created = created;
  }

  get id(): number | undefined {
    return this._id;
  }

  set id(id: number | undefined) {
    this._id = id ? z.number().parse(id) : id;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    if (!name) throw new MissingParamError("name");
    this._name = name;
  }

  get abbr(): string {
    return this._abbr;
  }

  set abbr(abbr: string) {
    if (!abbr) throw new MissingParamError("abbr");
    if (abbr.length > 3) throw new InvalidParamError("abbr");

    this._abbr = abbr;
  }

  get sort(): number {
    return this._sort;
  }

  set sort(sort: number | undefined) {
    this._sort = sort;
  }

  get created(): Date {
    return this._created;
  }

  set created(created: Date | undefined) {
    this._created = created;
  }
}
