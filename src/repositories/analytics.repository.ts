import prisma from "../config/prisma.js";

type AnalyticsData = {
  shortUrlId: number;
  ipAddress?: string | undefined;
  browser?: string | undefined;
  operatingSystem?: string | undefined;
  device?: string | undefined;
  referer?: string | undefined;
};

export const createClick = async (data: AnalyticsData) => {
  return prisma.analytics.create({
    data: {
      shortUrlId: data.shortUrlId,
      ipAddress: data.ipAddress ?? null,
      browser: data.browser ?? null,
      operatingSystem: data.operatingSystem ?? null,
      device: data.device ?? null,
      referer: data.referer ?? null,
    },
  });
};

export const getAnalyticsForUrl = async (shortUrlId: number) => {
  return prisma.analytics.findMany({
    where: { shortUrlId },
    orderBy: { clickedAt: "desc" },
  });
};
