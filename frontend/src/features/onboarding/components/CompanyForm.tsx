"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  Store, Loader2, Camera, Upload, FileCheck, ShieldCheck, AlertTriangle
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { CompanyFormData } from "../schema/onboardingSchema";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";

interface CompanyFormProps {
  form: UseFormReturn<CompanyFormData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  organizations: any[];
  t: any;
  initialLogo?: string | null;
}

export const CompanyForm = ({ form, onSubmit, isSubmitting, organizations, t, initialLogo }: CompanyFormProps) => {
  const { register, formState: { errors }, setValue, watch } = form;
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const nibInputRef = useRef<HTMLInputElement>(null);
  const ktpInputRef = useRef<HTMLInputElement>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(initialLogo || null);
  const [nibFileName, setNibFileName] = useState<string | null>(null);
  const [ktpPreview, setKtpPreview] = useState<string | null>(null);

  // Debug: Log validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
        console.log("Onboarding Step 1 Errors:", errors);
    }
  }, [errors]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof CompanyFormData, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(field as any, file, { shouldValidate: true, shouldDirty: true });
      
      if (type === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (field === 'logo') setLogoPreview(reader.result as string);
          if (field === 'ktp_file') setKtpPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setNibFileName(file.name);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8 pb-10">
      
      {/* Global Error Notice */}
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-sm font-bold">Data belum lengkap</AlertTitle>
          <AlertDescription className="text-xs">
            Ada beberapa kolom wajib yang belum diisi atau formatnya salah. Silakan periksa kolom bertanda merah di bawah.
          </AlertDescription>
        </Alert>
      )}

      {/* 1. Brand Identity Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-foreground">Identitas Usaha</h3>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex flex-col items-center gap-2">
                <div 
                    className={`relative group cursor-pointer h-24 w-24 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${errors.logo ? 'border-destructive bg-destructive/5' : 'border-border bg-muted/30 hover:border-primary/40'}`}
                    onClick={() => logoInputRef.current?.click()}
                >
                    {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                    ) : (
                        <Upload size={24} className="text-muted-foreground/40" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white h-6 w-6" />
                    </div>
                    <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo', 'image')} />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("click_to_upload_logo")}</p>
            </div>

            <div className="flex-1 w-full space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">{t("company_name")}</Label>
                    <Input {...register("name")} placeholder={t("company_name_placeholder")} className="h-11 rounded-xl" />
                    {errors.name && <p className="text-[10px] font-bold text-destructive ml-1">{t(`errors.${errors.name.message}`)}</p>}
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">{t("legal_entity")}</Label>
                    <select {...register("legal_entity_type")} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary">
                        <option value="Perseorangan">{t("legal_entity_options.Perseorangan")}</option>
                        <option value="CV">{t("legal_entity_options.CV")}</option>
                        <option value="PT">{t("legal_entity_options.PT")}</option>
                        <option value="PT Perorangan">{t("legal_entity_options.PT Perorangan")}</option>
                        <option value="Koperasi">{t("legal_entity_options.Koperasi")}</option>
                        <option value="Lainnya">{t("legal_entity_options.Lainnya")}</option>
                    </select>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dashed">
        <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">{t("owner_name")}</Label>
            <Input {...register("owner_name")} placeholder={t("owner_name_placeholder")} className="h-11 rounded-xl" />
            {errors.owner_name && <p className="text-[10px] font-bold text-destructive ml-1">{t(`errors.${errors.owner_name.message}`)}</p>}
        </div>

        <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">{t("nik")}</Label>
            <Input {...register("nik")} placeholder={t("nik_placeholder")} className="h-11 rounded-xl font-mono text-xs" maxLength={16} />
            {errors.nik && <p className="text-[10px] font-bold text-destructive ml-1">{t(`errors.${errors.nik.message}`)}</p>}
        </div>

        <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">{t("phone")}</Label>
            <Input {...register("phone")} placeholder={t("phone_placeholder")} className="h-11 rounded-xl" />
            {errors.phone && <p className="text-[10px] font-bold text-destructive ml-1">{t(`errors.${errors.phone.message}`)}</p>}
        </div>

        <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">{t("npwp")} (Opsional)</Label>
            <Input {...register("npwp")} placeholder={t("npwp_placeholder")} className="h-11 rounded-xl font-mono text-xs" />
        </div>
      </div>

      {/* 2. Legal Documentation Section */}
      <div className="space-y-6 pt-6 border-t">
        <h3 className="text-lg font-bold text-foreground">Dokumen Legalitas (Wajib)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Unggah Dokumen NIB</Label>
                <div 
                    onClick={() => nibInputRef.current?.click()}
                    className={`h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:bg-muted/50 ${nibFileName ? 'border-primary/40 bg-primary/5' : errors.nib_file ? 'border-destructive bg-destructive/5' : 'border-border'}`}
                >
                    {nibFileName ? (
                        <>
                            <FileCheck size={20} className="text-primary" />
                            <span className="text-[11px] font-bold truncate max-w-[150px]">{nibFileName}</span>
                        </>
                    ) : (
                        <>
                            <Upload size={20} className="text-muted-foreground/30" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t("click_to_upload_file")}</span>
                        </>
                    )}
                </div>
                <input type="file" ref={nibInputRef} className="hidden" accept=".pdf,image/*" onChange={(e) => handleFileChange(e, 'nib_file', 'file')} />
                {errors.nib_file && <p className="text-[10px] font-bold text-destructive ml-1">{t(`errors.${errors.nib_file.message}`)}</p>}
            </div>

            <div className="space-y-3">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Unggah Foto KTP Pemilik</Label>
                <div 
                    onClick={() => ktpInputRef.current?.click()}
                    className={`h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center overflow-hidden gap-1 cursor-pointer transition-all hover:bg-muted/50 ${ktpPreview ? 'border-primary/40 bg-primary/5' : errors.ktp_file ? 'border-destructive bg-destructive/5' : 'border-border'}`}
                >
                    {ktpPreview ? (
                        <img src={ktpPreview} alt="KTP" className="h-full w-full object-cover" />
                    ) : (
                        <>
                            <Upload size={20} className="text-muted-foreground/30" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t("click_to_upload_file")}</span>
                        </>
                    )}
                </div>
                <input type="file" ref={ktpInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'ktp_file', 'image')} />
                {errors.ktp_file && <p className="text-[10px] font-bold text-destructive ml-1">{t(`errors.${errors.ktp_file.message}`)}</p>}
            </div>
        </div>
      </div>

      {/* 3. Location & Operational Section */}
      <div className="space-y-6 pt-6 border-t">
        <h3 className="text-lg font-bold text-foreground">Lokasi & Operasional</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">{t("address")}</Label>
                <Input {...register("address")} placeholder={t("address_placeholder")} className="h-11 rounded-xl" />
                {errors.address && <p className="text-[10px] font-bold text-destructive ml-1">{t(`errors.${errors.address.message}`)}</p>}
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">{t("province")}</Label>
                <Input {...register("province")} placeholder={t("province_placeholder")} className="h-11 rounded-xl" />
                {errors.province && <p className="text-[10px] font-bold text-destructive ml-1">{t(`errors.${errors.province.message}`)}</p>}
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">{t("regency")}</Label>
                <Input {...register("regency")} placeholder={t("regency_placeholder")} className="h-11 rounded-xl" />
                {errors.regency && <p className="text-[10px] font-bold text-destructive ml-1">{t(`errors.${errors.regency.message}`)}</p>}
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Kecamatan</Label>
                <Input {...register("district")} placeholder="Masukkan Kecamatan" className="h-11 rounded-xl" />
                {errors.district && <p className="text-[10px] font-bold text-destructive ml-1">{t(`errors.${errors.district.message}`)}</p>}
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Kelurahan / Desa</Label>
                <Input {...register("village")} placeholder="Masukkan Kelurahan/Desa" className="h-11 rounded-xl" />
                {errors.village && <p className="text-[10px] font-bold text-destructive ml-1">{t(`errors.${errors.village.message}`)}</p>}
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">{t("sector")}</Label>
                <Input {...register("sector")} className="h-11 rounded-xl" placeholder="Contoh: Kuliner, Fashion, dll" />
                {errors.sector && <p className="text-[10px] font-bold text-destructive ml-1">{t(`errors.${errors.sector.message}`)}</p>}
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">{t("kbli")} (5 Digit)</Label>
                <Input {...register("kbli")} maxLength={5} className="h-11 rounded-xl font-mono text-sm" placeholder="Contoh: 10710" />
                {errors.kbli && <p className="text-[10px] font-bold text-destructive ml-1">{t(`errors.${errors.kbli.message}`)}</p>}
            </div>
            
            <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Nomor Induk Berusaha (NIB)</Label>
                <Input {...register("nib")} maxLength={13} className="h-11 rounded-xl font-mono text-sm" placeholder="Masukkan 13 digit NIB" />
                {errors.nib && <p className="text-[10px] font-bold text-destructive ml-1">{t(`errors.${errors.nib.message}`)}</p>}
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Tahun Berdiri</Label>
                <Input {...register("established_year", { valueAsNumber: true })} type="number" placeholder="YYYY" className="h-11 rounded-xl" />
                {errors.established_year && <p className="text-[10px] font-bold text-destructive ml-1">{t(`errors.${errors.established_year.message}`)}</p>}
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Jumlah Karyawan</Label>
                <Input {...register("employee_count", { valueAsNumber: true })} type="number" min={0} placeholder="Contoh: 5" className="h-11 rounded-xl" />
                {errors.employee_count && <p className="text-[10px] font-bold text-destructive ml-1">{t(`errors.${errors.employee_count.message}`)}</p>}
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Afiliasi Organisasi (Jika Ada)</Label>
                <select {...register("umkm_organization_id", { valueAsNumber: true })} className={`flex h-11 w-full rounded-xl border bg-background px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary ${errors.umkm_organization_id ? 'border-destructive' : 'border-input'}`}>
                    <option value="0">-- Tidak Ada / Mandiri --</option>
                    {organizations.map((org) => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                </select>
                <p className="text-[10px] text-muted-foreground mt-1 ml-1 italic">Pilih organisasi atau paguyuban jika Anda merupakan bagian dari kelompok tersebut.</p>
            </div>
        </div>
      </div>

      <div className="pt-6">
        <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full h-12 rounded-xl font-black text-base shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white transition-all active:scale-95"
        >
            {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
            {t("save_continue")}
        </Button>
      </div>
    </form>
  );
};
