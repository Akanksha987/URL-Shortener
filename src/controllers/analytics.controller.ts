import type { NextFunction, Request, Response } from "express";
import { AppError } from "../middleware/error.middleware.js";
import * as analyticsService from "../services/analytics.service.js";

export const getAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const code = req.params.code;

    if (typeof code !== "string") {
      throw new AppError("Short code is required", 400);
    }

    const result = await analyticsService.getUrlAnalytics(code, req.user?.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
