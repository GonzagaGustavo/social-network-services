import { Response } from "express";
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

  async GET(httpRequest: HttpRequest, res: Response): Promise<void> {
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

      const response = this.res.ok(
        users.map((user) => this.res.removeUnderline(user))
      );
      res.status(response.statusCode).send(response.body);
    } catch (err) {
      const response = this.res.badRequest(err);
      res.status(response.statusCode).send(response.body);
    }
  }

  async POST(httpRequest: HttpRequest, res: Response): Promise<void> {
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

      const response = this.res.ok({ success: true });
      res.status(response.statusCode).send(response.body);
    } catch (err) {
      console.error(err);
      const response = this.res.badRequest(err);
      res.status(response.statusCode).send(response.body);
    }
  }

  async PUT(httpRequest: HttpRequest, res: Response): Promise<void> {
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

        const response = this.res.ok(output);
        res.status(response.statusCode).send(response.body);
      } catch (err) {
        const response = this.res.badRequest(err);
        res.status(response.statusCode).send(response.body);
      }
    } else {
      const response = this.res.unauthorizedError();
      res.status(response.statusCode).send(response.body);
    }
  }

  async DELETE(httpRequest: HttpRequest, res: Response): Promise<void> {
    if (httpRequest.user && httpRequest.user.id === +httpRequest.params.id) {
      try {
        const deleted = await this.useCase.remove(+httpRequest.params.id);

        const response = this.res.ok(deleted);
        res.status(response.statusCode).send(response.body);
      } catch (err) {
        const response = this.res.badRequest(err);
        res.status(response.statusCode).send(response.body);
      }
    } else {
      const response = this.res.unauthorizedError();
      res.status(response.statusCode).send(response.body);
    }
  }
}
