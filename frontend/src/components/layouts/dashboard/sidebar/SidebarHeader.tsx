import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";

interface SidebarHeaderProps {
  collapsed: boolean;
}

export const SidebarHeader = ({ collapsed }: SidebarHeaderProps) => {
  const t = useTranslations("DashboardSidebar");

  return (
    <div className="sidebar-header">
      <Link href="/dashboard" className={`flex items-center ${collapsed ? "justify-center w-full" : "gap-2.5"}`}>
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-black text-primary-foreground text-sm shrink-0">
          M
        </div>
        {!collapsed && (
          <span className="font-bold tracking-tight uppercase text-sidebar-foreground text-sm whitespace-nowrap">
            {t("brand")}
          </span>
        )}
      </Link>
    </div>
  );
};