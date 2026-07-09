import * as analyticsRepository from "../repositories/analytics.repository.js";
import * as urlRepository from "../repositories/url.repository.js";
import { AppError } from "../middleware/error.middleware.js";

export const getUrlAnalytics = async (
  code: string,
  userId: number | undefined
) => {
  if (!userId) {
    throw new AppError("Login is required", 401);
  }

  const shortUrl = await urlRepository.findByCodeForUser(code, userId);

  if (!shortUrl) {
    throw new AppError("Short URL not found", 404);
  }

  const clicks = await analyticsRepository.getAnalyticsForUrl(shortUrl.id);

  return {
    shortUrl,
    totalClicks: shortUrl.clicks,
    clicks,
  };
};
