import prisma from "../db";
import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { RefreshToken } from "@prisma/client";

export interface UserPlayload {
  id: number;
  email: string;
}

export async function generateToken(playload: UserPlayload): Promise<{
  token: string;
  refreshToken: RefreshToken;
}> {
  const expiresIn = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hour

  const token = jwt.sign(playload, process.env.AUTH_SECRET, {
    expiresIn: expiresIn,
    subject: String(playload.id),
  });
  const refreshToken = await generateRefreshToken(playload.id, expiresIn);

  return { token, refreshToken };
}

async function generateRefreshToken(
  userId: number,
  expiresIn: number
): Promise<RefreshToken> {
  await prisma.refreshToken.deleteMany({
    where: {
      userId: userId,
    },
  });

  const generateRefreshToken = await prisma.refreshToken.create({
    data: {
      userId,
      expiresIn,
    },
  });
  prisma.$disconnect();

  return generateRefreshToken;
}

export async function generateTokenFromRefreshToken(refreshToken: string) {
  const refresh_token = await prisma.refreshToken.findFirst({
    where: {
      id: refreshToken,
    },
  });

  if (!refresh_token) return false;

  const user = await prisma.user.findFirst({
    where: {
      id: refresh_token.userId,
    },
  });

  if (!user) return false;

  const newToken = await generateToken({
    id: refresh_token.userId,
    email: user.email,
  });

  return newToken;
}

export const publicUser = {
  password: false,
  country: false,
  phone: false,
  city: false,
  estate: false,
  email: false,
  bio: true,
  birthday: false,
  gender: true,
  id: true,
  name: true,
  username: true,
};
