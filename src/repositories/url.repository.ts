import prisma from "../config/prisma.js";
import type { CreateUrlInput } from "../validators/url.validator.js";

type CreateShortUrlData = CreateUrlInput & {
  shortCode: string;
  userId: number;
};

export const createShortUrl = async (data: CreateShortUrlData) => {
  return prisma.shortUrl.create({
    data: {
      originalUrl: data.originalUrl,
      shortCode: data.shortCode,
      customAlias: data.customAlias ?? null,
      title: data.title ?? null,
      description: data.description ?? null,
      expiresAt: data.expiresAt ?? null,
      userId: data.userId,
    },
  });
};

export const findByShortCodeOrAlias = async (code: string) => {
  return prisma.shortUrl.findFirst({
    where: {
      OR: [{ shortCode: code }, { customAlias: code }],
    },
  });
};

export const findByCodeForUser = async (code: string, userId: number) => {
  return prisma.shortUrl.findFirst({
    where: {
      userId,
      OR: [{ shortCode: code }, { customAlias: code }],
    },
  });
};

export const listByUser = async (userId: number) => {
  return prisma.shortUrl.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const incrementClicks = async (id: number) => {
  return prisma.shortUrl.update({
    where: { id },
    data: {
      clicks: {
        increment: 1,
      },
    },
  });
};

export const deleteByCodeForUser = async (code: string, userId: number) => {
  return prisma.shortUrl.deleteMany({
    where: {
      userId,
      OR: [{ shortCode: code }, { customAlias: code }],
    },
  });
};
