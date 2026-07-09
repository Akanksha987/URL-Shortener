import jwt from "jsonwebtoken";

type TokenPayload = {
  id: number;
  email: string;
};

const accessTokenSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
};

const refreshTokenSecret = () => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not configured");
  }

  return secret;
};

export const signAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, accessTokenSecret(), { expiresIn: "15m" });
};

export const signRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(payload, refreshTokenSecret(), { expiresIn: "7d" });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, refreshTokenSecret()) as TokenPayload;
};
