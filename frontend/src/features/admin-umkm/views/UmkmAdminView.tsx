"use client";

import React from "react";
import { Store } from "lucide-react";
import { DashboardPageShell } from "@/src/components/layouts/dashboard/DashboardPageShell";
import { AdminToolbar, AdminSearchFilter } from "@/src/components/ui/dashboard/AdminDataView";
import { StatusAlert } from "@/src/components/ui/dashboard/StatusAlert";
import { LoadingState } from "@/src/components/ui/dashboard/LoadingSkeleton";
import { EmptyState } from "@/src/components/ui/dashboard/EmptyState";
import { UmkmCard } from "../components/UmkmCard";
import { useUmkmAdmin } from "../hooks/useUmkmAdmin";
import UmkmAssessmentDetail from "@/src/app/[locale]/(dashboard)/workspace/umkm/components/UmkmAssessmentDetail";

interface UmkmAdminViewProps {
  title: string;
  subtitle: string;
}

export function UmkmAdminView({ title, subtitle }: UmkmAdminViewProps) {
  const {
    filteredUmkm,
    loading,
    searchTerm,
    setSearchTerm,
    searchBy,
    setSearchBy,
    organization,
    detailUmkmId,
    setDetailUmkmId,
    searchOptions,
    status,
    setStatus
  } = useUmkmAdmin();

  if (detailUmkmId) {
    return <UmkmAssessmentDetail umkmId={detailUmkmId} onClose={() => setDetailUmkmId(null)} />;
  }

  return (
    <DashboardPageShell
      title={title}
      subtitle={subtitle}
      icon={Store}
    >
      <div className="space-y-6">
        <StatusAlert status={status} onDismiss={() => setStatus(null)} />

        <AdminToolbar>
          <AdminSearchFilter
            placeholder="Cari UMKM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            options={searchOptions}
            selectedOption={searchBy}
            onOptionChange={setSearchBy}
          />
          {organization && (
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 rounded-lg border border-primary/10">
              <span className="text-xs font-medium text-primary">{organization.name}</span>
            </div>
          )}
        </AdminToolbar>

        {loading ? (
          <LoadingState message="Memuat registry anggota..." />
        ) : filteredUmkm.length === 0 ? (
          <EmptyState icon={Store} title="Belum ada UMKM terdaftar" description="Tidak ada data UMKM yang memenuhi kriteria pencarian Anda." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUmkm.map((umkm: any) => (
              <UmkmCard 
                key={umkm.id} 
                umkm={umkm} 
                onViewAnalysis={setDetailUmkmId} 
              />
            ))}
          </div>
        )}
      </div>
    </DashboardPageShell>
  );
}
