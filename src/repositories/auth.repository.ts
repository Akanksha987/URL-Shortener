import prisma from "../config/prisma.js";

export const createUser = async (data: any) => {
  return await prisma.user.create({
    data,
  });
};

export const findByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const findById = async (id: any) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const saveRefreshToken = async (
  userId: string,
  refreshToken: string
) => {
  return;
};

export const deleteRefreshToken = async (userId: string) => {
  return;
};