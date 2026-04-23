"use client";

import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";
import { web } from "@/src/lib/http/axios";

interface SidebarLogoutProps {
  collapsed: boolean;
}

export const SidebarLogout = ({ collapsed }: SidebarLogoutProps) => {
  const t = useTranslations("DashboardSidebar");

  const handleLogout = async () => {
    try {
      // 1. Fetch CSRF cookie first to avoid 419
      await web.get("/sanctum/csrf-cookie");

      // 2. Perform logout
      await web.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // 3. Always clear local state
      Cookies.remove("token", { path: "/" });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // 4. Redirect to localized login page
      const locale = window.location.pathname.split("/")[1] || "id";
      window.location.href = `/${locale}/login`;
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      className={`sidebar-item w-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 group cursor-pointer ${
        collapsed ? "justify-center" : ""
      }`}
      title={collapsed ? t("logout") : undefined}
    >
      <LogOut size={18} className="sidebar-icon shrink-0 group-hover:-translate-x-0.5 transition-transform duration-200" />
      {!collapsed && (
        <span className="whitespace-nowrap overflow-hidden">{t("logout")}</span>
      )}
    </button>
  );
};