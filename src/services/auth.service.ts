import * as authRepository from "../repositories/auth.repository.js";

export const signupUser = async (data: any) => {
  return await authRepository.createUser(data);
};

export const loginUser = async (data: any) => {
  return {};
};

export const logoutUser = async (userId: string | undefined) => {
  return true;
};

export const generateAccessToken = async (refreshToken: string) => {
  return {
    accessToken: "",
  };
};

export const generateRefreshToken = async (userId: string) => {
  return "";
};

export const verifyUser = async (userId: string | undefined) => {
  return await authRepository.findById(userId);
};