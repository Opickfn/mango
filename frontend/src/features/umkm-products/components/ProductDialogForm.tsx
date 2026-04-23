"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { X, Save, Loader2, Package, Tag, Hash, Activity, CircleDollarSign, Box } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { ProductFormData } from "../schema/productSchema";

interface ProductDialogFormProps {
  form: UseFormReturn<ProductFormData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: any;
  t: any;
}

export const ProductDialogForm = ({
  form,
  onSubmit,
  isSubmitting,
  isOpen,
  onOpenChange,
  editingProduct,
  t,
}: ProductDialogFormProps) => {
  const { register, formState: { errors } } = form;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="bg-muted/30 border-b p-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <Package size={24} />
            </div>
            <div>
                <DialogTitle className="text-2xl font-black uppercase tracking-tight text-mango-blue leading-none">
                    {editingProduct ? t("modal_edit_title") : t("modal_create_title")}
                </DialogTitle>
                <DialogDescription className="font-medium mt-1">
                    {editingProduct ? "Perbarui informasi stok barang Anda." : "Daftarkan produk baru ke dalam katalog merchant."}
                </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nama Produk</Label>
              <div className="relative group">
                <Box className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                    {...register("name")} 
                    className="pl-11 h-12 rounded-2xl bg-muted/30 border-transparent focus:bg-background transition-all font-bold text-foreground" 
                    placeholder="Contoh: Kain Denim Indigo" 
                    disabled={isSubmitting} 
                />
              </div>
              {errors.name && <p className="text-[10px] font-bold text-destructive px-1">{t(`errors.${errors.name.message}`)}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kode SKU</Label>
                <div className="relative group">
                  <Hash className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    {...register("sku")} 
                    className="pl-11 h-11 rounded-2xl bg-muted/30 border-transparent focus:bg-background transition-all font-mono text-xs uppercase" 
                    placeholder="DNM-001" 
                    disabled={isSubmitting} 
                  />
                </div>
                {errors.sku && <p className="text-[10px] font-bold text-destructive px-1">{t(`errors.${errors.sku.message}`)}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Satuan</Label>
                <select 
                  {...register("unit")}
                  className="flex h-11 w-full rounded-2xl border-transparent bg-muted/30 px-3 py-2 text-sm font-bold focus:bg-background transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  disabled={isSubmitting}
                >
                  <option value="pcs">Pcs</option>
                  <option value="kg">Kg</option>
                  <option value="meter">Meter</option>
                  <option value="roll">Roll</option>
                  <option value="box">Box</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Harga Satuan</Label>
                <div className="relative group">
                  <CircleDollarSign className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-success transition-colors" />
                  <Input 
                    {...register("price")} 
                    type="number" 
                    className="pl-11 h-11 rounded-2xl bg-muted/30 border-transparent focus:bg-background transition-all font-bold" 
                    placeholder="0"
                    disabled={isSubmitting} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Status Stok</Label>
                <select 
                  {...register("is_active", { setValueAs: (v) => v === "true" })}
                  className="flex h-11 w-full rounded-2xl border-transparent bg-muted/30 px-3 py-2 text-sm font-bold focus:bg-background transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  disabled={isSubmitting}
                >
                  <option value="true">Tersedia (Active)</option>
                  <option value="false">Kosong (Disabled)</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 bg-muted/20 -mx-8 -mb-8 p-8 flex gap-3">
            <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                disabled={isSubmitting} 
                className="flex-1 rounded-2xl font-bold h-12 border-muted-foreground/20"
            >
              Batal
            </Button>
            <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="flex-1 rounded-2xl font-black uppercase text-xs tracking-widest gap-2 bg-primary h-12 shadow-lg shadow-primary/20"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingProduct ? "Simpan Perubahan" : "Daftarkan Produk"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
