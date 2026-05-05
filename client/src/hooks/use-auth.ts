import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/api/auth.service";
import { useAuthStore } from "@/store/use-auth-store";
import { LoginCredentials, RegisterData } from "@/types/api";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const logoutStore = useAuthStore((state) => state.logout);

  const login = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      if (response.success) {
        toast.success(response.message || "Login successful!");
        if (response.data?.user) {
          setAuth(response.data.user);
        }
        setTimeout(() => navigate("/"), 1500);
        return response;
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Invalid email or password");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      if (response.success) {
        toast.success(response.message || "Account created successfully!");
        if (response.data?.user) {
          setAuth(response.data.user);
        }
        setTimeout(() => navigate("/"), 1500);
        return response;
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      logoutStore();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error("Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    isLoading,
  };
};
