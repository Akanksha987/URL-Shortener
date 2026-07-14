import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { AppError } from "../middleware/error.middleware.js";
import * as urlService from "../services/url.service.js";

const getCodeParam = (req: Request) => {
  const code = req.params.code;

  if (typeof code !== "string") {
    throw new AppError("Short code is required", 400);
  }

  return code;
};

const buildShortUrl = (code: string) => {
  return `${env.baseUrl.replace(/\/$/, "")}/${code}`;
};

export const createShortUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await urlService.createUrl(req.body, req.user?.id);
    const publicCode = result.customAlias || result.shortCode;

    res.status(201).json({
      success: true,
      message: "Short URL created successfully",
      data: {
        ...result,
        shortUrl: buildShortUrl(publicCode),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const listShortUrls = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await urlService.listUserUrls(req.user?.id);

    res.status(200).json({
      success: true,
      data: result.map((url) => ({
        ...url,
        shortUrl: buildShortUrl(url.customAlias || url.shortCode),
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteShortUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await urlService.deleteUserUrl(getCodeParam(req), req.user?.id);

    res.status(200).json({
      success: true,
      message: "Short URL deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const redirectToOriginalUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const originalUrl = await urlService.resolveUrl(getCodeParam(req), {
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      referer: req.headers.referer,
    });

    res.redirect(originalUrl);
  } catch (error) {
    next(error);
  }
};
