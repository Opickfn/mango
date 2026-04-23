"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { X, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { AdminDialog } from "@/src/components/ui/dashboard/AdminDataView";
import { DepartmentFormData } from "../schema/orgSchema";

interface DeptDialogFormProps {
  form: UseFormReturn<DepartmentFormData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  onClose: () => void;
  editingDept: any;
  campus: any;
  t: any;
  tc: any;
}

export const DeptDialogForm = ({
  form,
  onSubmit,
  isSubmitting,
  onClose,
  editingDept,
  campus,
  t,
  tc,
}: DeptDialogFormProps) => {
  const { register, formState: { errors } } = form;

  return (
    <AdminDialog>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
        <div>
          <h2 className="text-lg font-bold text-foreground">{editingDept ? t("edit_title") : t("add")}</h2>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
            {editingDept ? "Modifikasi Unit Kerja" : "Tambahkan Unit Baru ke Institusi"}
          </p>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-muted-foreground hover:bg-background transition-colors">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Institusi Induk</Label>
            <Input value={campus?.name || "Memuat..."} disabled className="h-11 rounded-xl bg-muted/50 border-transparent font-bold" />
            <input type="hidden" {...register("institution_id", { valueAsNumber: true })} />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nama Unit/Departemen</Label>
            <Input {...register("name")} placeholder="Misal: Teknik Tekstil" className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all" disabled={isSubmitting} />
            {errors.name && <p className="text-[10px] font-bold text-destructive px-1">{t(`errors.${errors.name.message}`)}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Deskripsi Spesialisasi</Label>
            <Input {...register("description")} placeholder="Fokus bidang keahlian unit ini" className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all" disabled={isSubmitting} />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Status Operasional</Label>
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

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-11 rounded-xl font-bold border-muted-foreground/20">
            {tc("cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1 h-11 rounded-xl font-black uppercase text-xs tracking-widest gap-2 bg-primary">
            {isSubmitting ? <Save className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {editingDept ? tc("save_changes") : tc("create")}
          </Button>
        </div>
      </form>
    </AdminDialog>
  );
};
