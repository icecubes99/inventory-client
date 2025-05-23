import { useQueryClient } from "@tanstack/react-query";
import {
  useLoginUser,
  useLogoutUser,
  useRefreshToken,
} from "../mutations/authMutations";
import { LoginDTO, User } from "../services/authService";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../config";

interface SessionData {
  user: User;
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      setIsSessionLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/auth/session`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = (await response.json()) as SessionData;
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setUser(null);
      } finally {
        setIsSessionLoading(false);
      }
    };

    checkSession();
  }, []);

  const loginMutation = useLoginUser({
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const logoutMutation = useLogoutUser({
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
    },
  });

  const refreshTokenMutation = useRefreshToken({
    onSuccess: () => {
      // Token refresh is handled by httpOnly cookies
    },
  });

  const login = async (credentials: LoginDTO) => {
    return loginMutation.mutateAsync(credentials);
  };

  const logout = async () => {
    return logoutMutation.mutateAsync();
  };

  const refreshAccessToken = async () => {
    return refreshTokenMutation.mutateAsync();
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading:
      isSessionLoading ||
      loginMutation.isPending ||
      logoutMutation.isPending ||
      refreshTokenMutation.isPending,
    login,
    logout,
    refreshAccessToken,
  };
};
