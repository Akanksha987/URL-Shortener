import "dotenv/config";

const requiredEnv = ["DATABASE_URL", "JWT_SECRET"] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`${key} is required`);
  }
}

const parseAllowedOrigins = () => {
  const value = process.env.CORS_ORIGIN;

  if (!value || value === "*") {
    return "*";
  }

  return value.split(",").map((origin) => origin.trim());
};

const jwtSecret = process.env.JWT_SECRET as string;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || jwtSecret;

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  databaseUrl: process.env.DATABASE_URL as string,
  jwtSecret,
  jwtRefreshSecret,
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
  corsOrigin: parseAllowedOrigins(),
};
