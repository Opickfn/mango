"use client";

import React, { useState } from "react";
import { Loader2, UserCircle, Building2, Calendar, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { DashboardPageShell } from "@/src/components/layouts/dashboard/DashboardPageShell";
import { Badge } from "@/src/components/ui/badge";
import { StatusAlert } from "@/src/components/ui/dashboard/StatusAlert";
import { TabSwitch } from "@/src/components/ui/dashboard/TabSwitch";
import { SectionCard } from "@/src/components/ui/dashboard/SectionCard";
import { ProfileForm, PasswordForm } from "../components/ProfileForms";
import { useProfile } from "../hooks/useProfile";

export function ProfileView() {
  const [activeTab, setActiveTab] = useState<"overview" | "settings">("overview");
  const { 
    user, 
    profileForm, 
    passwordForm, 
    onProfileSubmit, 
    onPasswordSubmit, 
    isSubmitting, 
    status, 
    setStatus,
    t 
  } = useProfile();

  if (!user) {
    return (
      <div className="h-[60vh] w-full flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    );
  }

  const tabs = [
    { value: "overview", label: t("tabs.overview") },
    { value: "settings", label: t("tabs.settings") },
  ];

  return (
    <DashboardPageShell
      title={t("title")}
      subtitle={t("subtitle")}
      actions={<TabSwitch tabs={tabs} activeTab={activeTab} onTabChange={(v) => setActiveTab(v as any)} />}
    >
      <div className="space-y-6">
        <StatusAlert status={status} onDismiss={() => setStatus(null)} />

        {activeTab === "overview" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-background border rounded-xl p-6 text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCircle size={48} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{user.email}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {user.roles?.map((role: string) => (
                    <Badge key={role} variant="secondary" className="capitalize">
                      {role.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <SectionCard title="Account security" icon={Shield}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Email status</p>
                    <div className="flex items-center gap-2">
                      {user.email_verified_at ? (
                        <>
                          <CheckCircle2 size={16} className="text-success" />
                          <span className="text-sm font-medium">Verified</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={16} className="text-warning" />
                          <span className="text-sm font-medium">Unverified</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Member since</p>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-primary" />
                      <span className="text-sm font-medium">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </SectionCard>

              {user.umkm && (
                <SectionCard title="UMKM profile" icon={Building2}>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-dashed">
                      <span className="text-sm text-muted-foreground">Company name</span>
                      <span className="text-sm font-medium">{user.umkm.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-dashed">
                      <span className="text-sm text-muted-foreground">Sector</span>
                      <span className="text-sm font-medium">{user.umkm.sector}</span>
                    </div>
                  </div>
                </SectionCard>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            <ProfileForm 
              form={profileForm} 
              onSubmit={onProfileSubmit} 
              isSubmitting={isSubmitting} 
              t={t} 
            />
            <PasswordForm 
              form={passwordForm} 
              onSubmit={onPasswordSubmit} 
              isSubmitting={isSubmitting} 
              t={t} 
            />
          </div>
        )}
      </div>
    </DashboardPageShell>
  );
}
