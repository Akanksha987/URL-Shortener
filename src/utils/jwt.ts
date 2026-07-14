import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

type TokenPayload = {
  id: number;
  email: string;
};

export const signAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "15m" });
};

export const signRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: "7d" });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.jwtRefreshSecret) as TokenPayload;
};
