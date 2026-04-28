"use client";

import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";

interface SidebarHeaderProps {
  collapsed: boolean;
  user: any;
}

export const SidebarHeader = ({ collapsed, user }: SidebarHeaderProps) => {
  const t = useTranslations("DashboardSidebar");

  // Determine if this is a UMKM user
  const isUmkm = user?.roles?.includes("umkm");
  const umkm = user?.umkm;
  
  // Name for fallback letter
  const nameToUse = (isUmkm && umkm?.name) ? umkm.name : (user?.name || "M");
  const firstLetter = nameToUse.charAt(0).toUpperCase();
  
  // Logo Logic Sync with Identity Page (Priority: UMKM Logo > User Avatar > First Letter)
  const isPlaceholder = (url?: string) => !url || url.includes('placeholders');
  
  const hasUmkmLogo = isUmkm && umkm?.logo_url && !isPlaceholder(umkm.logo_url);
  const hasUserAvatar = user?.avatar_url && !isPlaceholder(user.avatar_url);

  return (
    <div className="sidebar-header">
      <Link href="/dashboard" className={`flex items-center ${collapsed ? "justify-center w-full" : "gap-3"}`}>
        {/* Symmetrical Rounded Logo Box - Synced with Identity Style */}
        <div className="w-9 h-9 rounded-lg overflow-hidden border border-primary/20 shadow-sm shrink-0 flex-shrink-0 bg-white">
          {hasUmkmLogo ? (
            <img 
              src={umkm.logo_url} 
              alt={nameToUse} 
              className="w-full h-full object-cover"
            />
          ) : hasUserAvatar ? (
            <img 
              src={user.avatar_url} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center text-white font-black text-sm uppercase">
              {firstLetter}
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="flex flex-col min-w-0 overflow-hidden">
            <span className="font-bold tracking-tight text-sidebar-foreground text-xs whitespace-nowrap">
              {t("brand")}
            </span>
            <span className="text-[10px] text-muted-foreground truncate font-medium">
              {nameToUse}
            </span>
          </div>
        )}
      </Link>
    </div>
  );
};
