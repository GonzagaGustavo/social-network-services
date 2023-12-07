import MissingParamError from "../../../interfaces/errors/missing-param";
import User from "../../entities/User/User";
import UserRepository from "../../repositories/User/user.repository";
import {
  CreateUserInput,
  ReadUserInput,
  UpdateUserInput,
  UserOutput,
} from "./user.dto";

export default class UserUseCase {
  userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async create(input: CreateUserInput): Promise<User> {
    const birthday = new Date(input.birthday);
    const user = new User({ ...input, birthday: birthday });

    return await this.userRepository.create(user);
  }

  async update(input: UpdateUserInput): Promise<User> {
    const birthday = new Date(input.birthday);
    const user = new User({ ...input, birthday: birthday });

    return await this.userRepository.update(user);
  }

  async read(input: ReadUserInput): Promise<UserOutput[]> {
    const users = await this.userRepository.paginate(input);

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      gender: user.gender,
      username: user.username,
      birthday: user.birthday.toUTCString(),
      created: user.created.toUTCString(),
    }));
  }

  async getById(id: number): Promise<User> {
    return await this.userRepository.getById(id);
  }

  async remove(id: number): Promise<User> {
    if (!id) throw new MissingParamError("id");
    return await this.userRepository.remove(id);
  }
}
