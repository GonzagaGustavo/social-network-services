import { Response } from "express";
import Controller, {
  HttpRequest,
  ResponseObject,
} from "../../../interfaces/controller";
import JwtRepository from "../../repositories/Jwt/jwt.repository";
import UserRepository from "../../repositories/User/user.repository";
import JwtUseCase from "../../usecases/Jwt/jwt.usecase";
import LoginUseCase from "../../usecases/User/login.usecase";

export default class AuthenticationController extends Controller<JwtUseCase> {
  useCase: JwtUseCase;

  constructor() {
    super();
    const userRepository = new UserRepository("user");
    const jwtRepository = new JwtRepository("jwt");

    this.useCase = new JwtUseCase(jwtRepository, userRepository);
  }

  async GET(httpRequest: HttpRequest, res: Response): Promise<void> {
    if (!httpRequest.user) {
      const response = this.res.unauthorizedError();
      res.status(response.statusCode).send(response.body);
    }

    const response = this.res.ok(httpRequest.user);
    res.status(response.statusCode).send(response.body);
  }

  async POST(httpRequest: HttpRequest, res: Response): Promise<void> {
    try {
      const useCase = new LoginUseCase(
        this.useCase.userRepository,
        this.useCase
      );
      const results = await useCase.execute(httpRequest.body);
      const response = this.res.ok(results);
      res.status(response.statusCode).send(response.body);
    } catch (err) {
      console.error(err);
      const response = this.res.badRequest(err);
      res.status(response.statusCode).send(response.body);
    }
  }

  async PUT(httpRequest: HttpRequest, res: Response): Promise<void> {
    const response = this.res.invalidMethod("PUT");
    res.status(response.statusCode).send(response.body);
  }

  async DELETE(httpRequest: HttpRequest, res: Response): Promise<void> {
    if (!httpRequest.user) {
      const response = this.res.unauthorizedError();
      res.status(response.statusCode).send(response.body);
    }
  }
}
