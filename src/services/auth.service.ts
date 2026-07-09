import * as authRepository from "../repositories/auth.repository.js";
import { AppError } from "../middleware/error.middleware.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import {
  loginSchema,
  signupSchema,
} from "../validators/auth.validator.js";
import type {
  LoginInput,
  SignupInput,
} from "../validators/auth.validator.js";

const refreshTokenExpiry = () => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  return expiresAt;
};

const authResponse = async (user: { id: number; email: string; name: string }) => {
  const payload = { id: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await authRepository.saveRefreshToken(
    user.id,
    refreshToken,
    refreshTokenExpiry()
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

export const signupUser = async (data: SignupInput) => {
  const validatedData = signupSchema.parse(data);
  const existingUser = await authRepository.findByEmail(validatedData.email);

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const hashedPassword = await hashPassword(validatedData.password);

  const user = await authRepository.createUser({
    ...validatedData,
    password: hashedPassword,
  });

  return authResponse(user);
};

export const loginUser = async (data: LoginInput) => {
  const validatedData = loginSchema.parse(data);
  const user = await authRepository.findByEmail(validatedData.email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await comparePassword(
    validatedData.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  return authResponse(user);
};

export const logoutUser = async (userId: number | undefined) => {
  if (!userId) {
    throw new AppError("User not found in request", 401);
  }

  await authRepository.deleteRefreshTokensByUserId(userId);
  return true;
};

export const generateAccessToken = async (refreshToken: string | undefined) => {
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

  const storedToken = await authRepository.findRefreshToken(refreshToken);

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const payload = verifyRefreshToken(refreshToken);

  return {
    accessToken: signAccessToken({ id: payload.id, email: payload.email }),
  };
};

export const verifyUser = async (userId: number | undefined) => {
  if (!userId) {
    throw new AppError("User not found in request", 401);
  }

  const user = await authRepository.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};
