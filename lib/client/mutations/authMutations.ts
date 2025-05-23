import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  LoginResponse,
  loginUser,
  LogoutResponse,
  logoutUser,
  RefreshTokenResponse,
  refreshToken,
} from "../services/authService";
import { LoginDTO } from "../services/authService";

interface LoginError {
  message: string;
  statusCode: number;
}

interface RefreshTokenError {
  message: string;
  statusCode: number;
}

interface LogoutError {
  message: string;
  statusCode: number;
}

export const useLoginUser = (
  mutationOptions?: UseMutationOptions<LoginResponse, LoginError, LoginDTO>
) =>
  useMutation({
    mutationFn: (credentials) => loginUser(credentials),
    ...mutationOptions,
  });

export const useRefreshToken = (
  mutationOptions?: UseMutationOptions<
    RefreshTokenResponse,
    RefreshTokenError,
    void
  >
) =>
  useMutation({
    mutationFn: () => refreshToken(),
    ...mutationOptions,
  });

export const useLogoutUser = (
  mutationOptions?: UseMutationOptions<LogoutResponse, LogoutError, void>
) =>
  useMutation({
    mutationFn: () => logoutUser(),
    ...mutationOptions,
  });
