import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import urlRoutes from "./routes/url.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import { env } from "./config/env.js";
import { redirectToOriginalUrl } from "./controllers/url.controller.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: env.corsOrigin !== "*",
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    environment: env.nodeEnv,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/urls", urlRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/:code", redirectToOriginalUrl);

app.use(notFound);
app.use(errorHandler);

export default app;

