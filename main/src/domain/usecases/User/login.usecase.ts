import { compareSync } from "bcrypt";
import UserRepository from "../../repositories/User/user.repository";
import { LoginInput, LoginOutput } from "./login.dto";
import InvalidParamError from "../../../interfaces/errors/invalid-param";
import JwtUseCase from "../Jwt/jwt.usecase";

export default class LoginUseCase {
  userRepository: UserRepository;
  jwtUseCase: JwtUseCase;

  constructor(userRepository: UserRepository, jwtUseCase: JwtUseCase) {
    this.userRepository = userRepository;
    this.jwtUseCase = jwtUseCase;
  }

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.paginate({
      where: `AND email='${input.email}'`,
      page: 1,
      search: "",
      order: "",
      limit: 1,
      desc: false,
      more: false,
    });

    if (!user[0]) {
      throw new InvalidParamError("email");
      return;
    }

    if (compareSync(input.password, user[0].password)) {
      return await this.jwtUseCase.generate({
        playload: { id: user[0].id, email: user[0].email, name: user[0].name },
      });
    } else {
      throw new InvalidParamError("password");
    }
  }
}
