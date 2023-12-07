import { Filter } from "../../../interfaces/repository";

export interface CreateCountryInput {
  name: string;
  abbr: string;
}
export interface UpdateCountryInput {
  id: number;
  name: string;
  abbr: string;
  sort?: number;
  created?: Date;
}
export interface ReadCountryInput extends Filter {}
