"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { api, web } from "@/src/lib/http/axios";
import { User, AuthState } from "@/src/types/auth";
import { Loader2 } from "lucide-react";

type AuthContextType = AuthState & {
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      const res = await api.get("/v1/me");
      // Backend return format is { success: true, data: { user: {...}, is_super_admin: true }, message: "" }
      const body = res.data;
      const apiData = body.data;
      
      let user = null;
      if (apiData?.user) {
        user = {
          ...apiData.user,
          is_super_admin: !!apiData.is_super_admin
        };
      } else if (body.user) {
        user = body.user;
      } else if (body.id && body.email) {
        user = body;
      }
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
      });
      return user;
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return null;
    }
  };

  const logout = async () => {
    try {
      // Inisialisasi CSRF untuk session baru
      await web.get("/sanctum/csrf-cookie");
      
      // Panggil logout Fortify dengan header JSON agar tidak terjadi redirect 302
      await web.post("/logout", {}, {
        headers: {
          "Accept": "application/json",
        }
      });

      setState({ user: null, isLoading: false, isAuthenticated: false });
      
      // Gunakan router untuk navigasi yang lebih mulus atau hard reload ke login
      window.location.href = "/login?logout=success";
    } catch (error) {
      console.error("Logout failed", error);
      // Tetap paksa logout di sisi client jika API gagal (misal session sudah expired)
      setState({ user: null, isLoading: false, isAuthenticated: false });
      window.location.href = "/login?logout=success";
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    ...state,
    refreshUser: async () => {
      await fetchUser();
    },
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
