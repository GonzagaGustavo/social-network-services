import { Filter } from "src/abstract/repository";

export interface CreateSearchInput {
  user_id: number;
  search: string;
}
export interface UpdateSearchInput {
  id: number;
  name: string;
  abbr: string;
  sort?: number;
  created?: Date;
}
export interface ReadSearchInput extends Filter {}
