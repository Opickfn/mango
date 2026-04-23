"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { X, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { AdminDialog } from "@/src/components/ui/dashboard/AdminDataView";
import { OrganizationFormData } from "../schema/orgSchema";

interface OrgDialogFormProps {
  form: UseFormReturn<OrganizationFormData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  onClose: () => void;
  editingOrg: any;
  t: any;
  tc: any;
}

export const OrgDialogForm = ({
  form,
  onSubmit,
  isSubmitting,
  onClose,
  editingOrg,
  t,
  tc,
}: OrgDialogFormProps) => {
  const { register, formState: { errors } } = form;

  return (
    <AdminDialog>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
        <div>
          <h2 className="text-lg font-bold text-foreground">{editingOrg ? t("edit_title") : t("add")}</h2>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
            {editingOrg ? "Modifikasi Identitas Institusi" : "Daftarkan Institusi Baru"}
          </p>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-muted-foreground hover:bg-background transition-colors">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nama Institusi</Label>
            <Input {...register("name")} className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all" disabled={isSubmitting} />
            {errors.name && <p className="text-[10px] font-bold text-destructive px-1">{t(`errors.${errors.name.message}`)}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tipe</Label>
              <select 
                {...register("type")}
                className="flex h-11 w-full rounded-xl border-transparent bg-muted/30 px-3 py-2 text-sm focus:bg-background transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
              >
                <option value="kampus">Kampus</option>
                <option value="upt">UPT</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Status</Label>
              <select 
                {...register("is_active", { setValueAs: (v) => v === "true" })}
                className="flex h-11 w-full rounded-xl border-transparent bg-muted/30 px-3 py-2 text-sm focus:bg-background transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
              >
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Resmi</Label>
              <Input {...register("email")} type="email" className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all" disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Telepon</Label>
              <Input {...register("phone")} className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all" disabled={isSubmitting} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Alamat</Label>
            <Input {...register("address")} className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all" disabled={isSubmitting} />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-11 rounded-xl font-bold border-muted-foreground/20">
            {tc("cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1 h-11 rounded-xl font-black uppercase text-xs tracking-widest gap-2 bg-primary">
            {isSubmitting ? <Save className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {editingOrg ? tc("save_changes") : tc("create")}
          </Button>
        </div>
      </form>
    </AdminDialog>
  );
};
