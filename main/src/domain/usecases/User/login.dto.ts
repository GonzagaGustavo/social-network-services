import { GenerateJwtOutput } from "../Jwt/jwt.dto";

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput extends GenerateJwtOutput {}
