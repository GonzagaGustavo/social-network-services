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

  async GET(httpRequest: HttpRequest): Promise<ResponseObject> {
    if (!httpRequest.user) return this.res.unauthorizedError();

    return this.res.ok(httpRequest.user);
  }

  async POST(httpRequest: HttpRequest): Promise<ResponseObject> {
    try {
      const useCase = new LoginUseCase(
        this.useCase.userRepository,
        this.useCase
      );
      const res = await useCase.execute(httpRequest.body);
      return this.res.ok(res);
    } catch (err) {
      console.error(err);
      return this.res.badRequest(err);
    }
  }

  async PUT(httpRequest: HttpRequest): Promise<ResponseObject> {
    return this.res.invalidMethod("PUT");
  }

  async DELETE(httpRequest: HttpRequest): Promise<ResponseObject> {
    if (!httpRequest.user) return this.res.unauthorizedError();
  }
}
