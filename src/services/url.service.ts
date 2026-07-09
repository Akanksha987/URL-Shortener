import * as analyticsRepository from "../repositories/analytics.repository.js";
import * as urlRepository from "../repositories/url.repository.js";
import { AppError } from "../middleware/error.middleware.js";
import { generateShortCode } from "../utils/generateShortCode.js";
import { createUrlSchema } from "../validators/url.validator.js";
import type { CreateUrlInput } from "../validators/url.validator.js";

const getUniqueShortCode = async () => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const shortCode = generateShortCode();
    const existingUrl = await urlRepository.findByShortCodeOrAlias(shortCode);

    if (!existingUrl) {
      return shortCode;
    }
  }

  throw new AppError("Could not generate a unique short code", 500);
};

export const createUrl = async (
  data: CreateUrlInput,
  userId: number | undefined
) => {
  if (!userId) {
    throw new AppError("Login is required", 401);
  }

  const validatedData = createUrlSchema.parse(data);

  if (validatedData.customAlias) {
    const existingAlias = await urlRepository.findByShortCodeOrAlias(
      validatedData.customAlias
    );

    if (existingAlias) {
      throw new AppError("Custom alias is already taken", 409);
    }
  }

  const shortCode = await getUniqueShortCode();

  return urlRepository.createShortUrl({
    ...validatedData,
    shortCode,
    userId,
  });
};

export const listUserUrls = async (userId: number | undefined) => {
  if (!userId) {
    throw new AppError("Login is required", 401);
  }

  return urlRepository.listByUser(userId);
};

export const deleteUserUrl = async (
  code: string,
  userId: number | undefined
) => {
  if (!userId) {
    throw new AppError("Login is required", 401);
  }

  const result = await urlRepository.deleteByCodeForUser(code, userId);

  if (result.count === 0) {
    throw new AppError("Short URL not found", 404);
  }

  return true;
};

export const resolveUrl = async (
  code: string,
  requestInfo: {
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
    referer?: string | undefined;
  }
) => {
  const shortUrl = await urlRepository.findByShortCodeOrAlias(code);

  if (!shortUrl || !shortUrl.isActive) {
    throw new AppError("Short URL not found", 404);
  }

  if (shortUrl.expiresAt && shortUrl.expiresAt < new Date()) {
    throw new AppError("This short URL has expired", 410);
  }

  await urlRepository.incrementClicks(shortUrl.id);
  await analyticsRepository.createClick({
    shortUrlId: shortUrl.id,
    ipAddress: requestInfo.ipAddress,
    browser: requestInfo.userAgent,
    referer: requestInfo.referer,
  });

  return shortUrl.originalUrl;
};
