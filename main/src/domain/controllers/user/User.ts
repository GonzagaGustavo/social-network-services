import Controller, {
  HttpRequest,
  ResponseObject,
} from "../../../interfaces/controller";
import { Filter } from "../../../interfaces/repository";
import UserRepository from "../../repositories/User/user.repository";
import { CreateUserInput, UpdateUserInput } from "../../usecases/User/user.dto";
import UserUseCase from "../../usecases/User/user.usecase";

export default class UserController extends Controller<UserUseCase> {
  repository: UserRepository;
  useCase: UserUseCase;

  constructor() {
    super();
    this.repository = new UserRepository("user");
    this.useCase = new UserUseCase(this.repository);
  }

  async GET(httpRequest: HttpRequest): Promise<ResponseObject> {
    try {
      const input: Filter = {
        page: httpRequest.query.page ? +httpRequest.query.page : 1,
        search: httpRequest.query.search ? httpRequest.query.search : "",
        order: httpRequest.query.order ? httpRequest.query.order : "",
        limit: httpRequest.query.limit ? +httpRequest.query.limit : 8,
        desc: Boolean(httpRequest.query.desc),
        more: Boolean(httpRequest.query.more),
      };

      const users = await this.useCase.read(input);

      return this.res.ok(users.map((user) => this.res.removeUnderline(user)));
    } catch (err) {
      return this.res.badRequest(err);
    }
  }

  async POST(httpRequest: HttpRequest): Promise<ResponseObject> {
    try {
      const input: CreateUserInput = {
        username: httpRequest.body.username,
        name: httpRequest.body.name,
        email: httpRequest.body.email,
        password: httpRequest.body.password,
        bio: httpRequest.body.bio,
        birthday: httpRequest.body.birthday,
        gender: httpRequest.body.gender,
      };

      const user = await this.useCase.create(input);

      return this.res.ok({ success: true });
    } catch (err) {
      console.error(err);
      return this.res.badRequest(err);
    }
  }

  async PUT(httpRequest: HttpRequest): Promise<ResponseObject> {
    if (httpRequest.user && httpRequest.user.id === +httpRequest.params.id) {
      try {
        const input: UpdateUserInput = {
          id: httpRequest.body.id,
          username: httpRequest.body.username,
          name: httpRequest.body.name,
          email: httpRequest.body.email,
          password: httpRequest.body.password,
          bio: httpRequest.body.bio,
          birthday: httpRequest.body.birthday,
          gender: httpRequest.body.gender,
          phone: httpRequest.body.phone,
          country: httpRequest.body.country,
          estate: httpRequest.body.estate,
          city: httpRequest.body.city,
        };

        const output = await this.useCase.update(input);

        return this.res.ok(output);
      } catch (err) {
        return this.res.badRequest(err);
      }
    } else {
      return this.res.unauthorizedError();
    }
  }

  async DELETE(httpRequest: HttpRequest): Promise<ResponseObject> {
    if (httpRequest.user && httpRequest.user.id === +httpRequest.params.id) {
      try {
        const deleted = await this.useCase.remove(+httpRequest.params.id);

        return this.res.ok(deleted);
      } catch (err) {
        return this.res.badRequest(err);
      }
    } else {
      return this.res.unauthorizedError();
    }
  }
}
