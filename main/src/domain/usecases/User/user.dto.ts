import { Filter } from "../../../interfaces/repository";
import User from "../../entities/User/User";

export interface CreateUserInput {
  username: string;
  name: string;
  email: string;
  password: string;
  bio: string;
  gender: string;
  birthday: string;
}
export interface UpdateUserInput {
  id: number;
  username: string;
  name: string;
  email: string;
  birthday: string;
  gender: string;
  bio: string;
  city: string;
  country: string;
  estate: string;
  phone: string;
  password: string;
}
export interface UserOutput {
  id?: number;
  username: string;
  name: string;
  email: string;
  bio: string;
  gender: string;
  birthday: string;
  created?: string;
}

export interface ReadUserInput extends Filter {}
