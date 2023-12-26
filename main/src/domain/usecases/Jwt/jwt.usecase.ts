import jwt from "jsonwebtoken";
import { GenerateJwtInput, GenerateJwtOutput } from "./jwt.dto";
import JwtRepository from "../../repositories/Jwt/jwt.repository";
import Jwt from "../../entities/Jwt/jwt";
import UserRepository from "../../repositories/User/user.repository";

interface GenerateRefreshInput {
  id: number;
  expiresIn: number;
}
interface RefreshInput {
  id: string;
}

export default class JwtUseCase {
  userRepository: UserRepository;
  jwtRepository: JwtRepository;

  constructor(jwtRepository: JwtRepository, userRepository: UserRepository) {
    this.jwtRepository = jwtRepository;
    this.userRepository = userRepository;
  }

  async generate({ playload }: GenerateJwtInput): Promise<GenerateJwtOutput> {
    const expiresIn = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hour

    const token = jwt.sign(playload, process.env.AUTH_SECRET, {
      expiresIn: expiresIn,
      subject: String(playload.id),
    });
    const refreshToken = await this.generateRefresh({
      id: playload.id,
      expiresIn,
    });

    return { token, refreshToken };
  }

  async refresh({ id }: RefreshInput): Promise<GenerateJwtOutput | false> {
    const refresh_token = await this.jwtRepository.getById(id);

    if (!refresh_token) return false;

    const user = await this.userRepository.getById(refresh_token.userId);

    if (!user) return false;

    const newToken = await this.generate({
      playload: {
        id: refresh_token.userId,
        email: user.email,
        name: user.name,
      },
    });

    return newToken;
  }

  private async generateRefresh({
    id,
    expiresIn,
  }: GenerateRefreshInput): Promise<Jwt> {
    await this.jwtRepository.remove(id);

    return await this.jwtRepository.create(new Jwt({ userId: id, expiresIn }));
  }
}
