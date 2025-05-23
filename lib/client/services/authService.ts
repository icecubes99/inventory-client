import { BASE_URL } from "../../config";

const AUTH_URI = "/auth";

export interface LoginDTO {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  user: User;
}

export interface RefreshTokenResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}

export const loginUser = async (
  credentials: LoginDTO
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${BASE_URL}${AUTH_URI}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        throw new Error("Invalid credentials");
      }
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  try {
    const response = await fetch(`${BASE_URL}${AUTH_URI}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Token refresh failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred during token refresh");
  }
};

export const logoutUser = async (): Promise<LogoutResponse> => {
  try {
    const response = await fetch(`${BASE_URL}${AUTH_URI}/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Logout failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred during logout");
  }
};
