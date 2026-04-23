"use client";

import React, { useMemo } from "react";
import { DashboardPageShell } from "@/src/components/layouts/dashboard/DashboardPageShell";
import { ClipboardCheck, AlertCircle, Loader2 } from "lucide-react";
import AssessmentForm from "./components/AssessmentForm";
import AssessmentHistory from "./components/AssessmentHistory";
import { useAuth } from "@/src/components/providers/AuthProvider";

export default function AssessmentPage() {
  const { user, isLoading } = useAuth();

  const umkmId = useMemo(() => user?.umkm?.id || null, [user]);

  return (
    <DashboardPageShell
      title="Self-Assessment Kematangan UMKM"
      subtitle="Ukur tingkat kesiapan digital dan operasional bisnis Anda melalui 6 dimensi utama."
      icon={ClipboardCheck}
    >
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : umkmId ? (
        <div className="space-y-12">
          <AssessmentForm umkmId={umkmId} />
          <AssessmentHistory umkmId={umkmId} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-4 rounded-full bg-destructive/10 text-destructive">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-xl font-bold">Data UMKM Belum Lengkap</h2>
          <p className="text-muted-foreground max-w-md">
            Anda perlu melengkapi profil UMKM terlebih dahulu sebelum dapat melakukan self-assessment.
          </p>
        </div>
      )}
    </DashboardPageShell>
  );
}
