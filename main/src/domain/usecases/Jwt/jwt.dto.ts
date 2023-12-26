export interface GenerateJwtInput {
  playload: { id: number; email: string; name: string };
}

export interface RefreshToken {
  id: string;
  expiresIn: number;
  userId: number;
}

export interface GenerateJwtOutput {
  token: string;
  refreshToken: RefreshToken;
}
