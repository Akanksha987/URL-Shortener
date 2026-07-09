import prisma from "../config/prisma.js";
import type { SignupInput } from "../validators/auth.validator.js";

export const createUser = async (data: SignupInput) => {
  return prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
};

export const findByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const saveRefreshToken = async (
  userId: number,
  refreshToken: string,
  expiresAt: Date
) => {
  return prisma.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      expiresAt,
    },
  });
};

export const findRefreshToken = async (refreshToken: string) => {
  return prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });
};

export const deleteRefreshToken = async (refreshToken: string) => {
  return prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
};

export const deleteRefreshTokensByUserId = async (userId: number) => {
  return prisma.refreshToken.deleteMany({
    where: { userId },
  });
};
