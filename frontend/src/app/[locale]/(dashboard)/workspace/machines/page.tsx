"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/src/lib/http/axios";
import { 
  Loader2, 
  Package,
  Plus,
  Pencil,
  Trash2,
  Save,
  Wrench,
  Tag,
  MapPin,
  CircleDollarSign,
  AlertCircle,
  CheckCircle2,
  X,
  Building2
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { DashboardPageShell } from "@/src/components/layouts/dashboard/DashboardPageShell";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

export default function MachineCatalogPage() {
    const [machines, setMachines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const [userContext, setUserContext] = useState<any>(null);
    const [status, setStatus] = useState<{ type: "success" | "destructive"; message: string } | null>(null);

    const [form, setForm] = useState({
        name: "",
        code: "",
        type: "CNC",
        brand: "",
        description: "",
        location: "",
        hourly_rate: "0"
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const userRes = await api.get("/v1/me");
            const userData = userRes.data.data?.user || userRes.data.user;
            setUserContext(userData);

            const machRes = await api.get("/v1/machines");
            // Only show machines owned by the current user
            const ownerType = userData.roles?.includes('upt') ? 'App\\Models\\Master\\Organization' : 'App\\Models\\Umkm\\Umkm';
            const ownerId = userData.roles?.includes('upt') ? userData.organizations?.[0]?.id : userData.umkm?.id;
            
            const filteredMachines = machRes.data.data?.filter((m: any) => 
                m.owner_type === ownerType && m.owner_id === ownerId
            ) || [];
            
            setMachines(filteredMachines);
        } catch (err) {
            console.error("Gagal mengambil katalog mesin:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const openDialog = () => {
        setForm({
            name: "",
            code: "",
            type: "CNC",
            brand: "",
            description: "",
            location: "",
            hourly_rate: "0"
        });
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus(null);

        try {
            const ownerType = userContext?.roles?.includes('upt') ? 'organization' : 'umkm';
            const ownerId = userContext?.roles?.includes('upt') ? userContext?.organizations?.[0]?.id : userContext?.umkm?.id;

            if (!ownerId) {
                setStatus({ type: "destructive", message: "Gagal menemukan ID pemilik (UPT/UMKM)." });
                setSubmitting(false);
                return;
            }

            await api.post("/v1/machines", {
                ...form,
                owner_type: ownerType,
                owner_id: ownerId
            });
            setStatus({ type: "success", message: "Mesin berhasil ditambahkan ke katalog reservasi." });
            setDialogOpen(false);
            fetchData();
        } catch (err: any) {
            let errorMsg = err.response?.data?.message || "Gagal menyimpan data mesin.";
            if (err.response?.status === 422 && err.response?.data?.errors) {
                const firstError = Object.values(err.response.data.errors)[0] as string[];
                errorMsg = firstError[0];
            }
            setStatus({ type: "destructive", message: errorMsg });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">Menyiapkan katalog mesin...</p>
        </div>
    );

    return (
        <DashboardPageShell
            title="Katalog Mesin Reservasi"
            subtitle="Kelola aset mesin produksi yang dapat direservasi."
            icon={Wrench}
            actions={
                <Button onClick={() => openDialog()} className="gap-2 rounded-2xl font-bold h-11 shadow-lg shadow-primary/20 bg-primary">
                    <Plus size={18} /> Tambah mesin
                </Button>
            }
        >
            <div className="space-y-8">
                {status && (
                    <Alert variant={status.type} className="animate-in fade-in slide-in-from-top-2 duration-300 rounded-2xl">
                        {status.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        <AlertDescription className="flex items-center justify-between">
                            {status.message}
                            <button onClick={() => setStatus(null)} className="ml-4">
                                <X size={16} className="opacity-50 hover:opacity-100" />
                            </button>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 gap-8">
                    {machines.length === 0 ? (
                        <Card className="border-dashed border-2 bg-muted/10 py-20 text-center rounded-[2.5rem]">
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-3xl bg-muted w-fit mx-auto">
                                    <Wrench size={48} className="text-muted-foreground opacity-30" />
                                </div>
                                <p className="text-muted-foreground font-bold text-sm">Belum ada mesin reservasi di katalog Anda.</p>
                                <Button onClick={() => openDialog()} variant="outline" className="rounded-xl font-bold h-11">Mulai tambah mesin</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {machines.map((machine) => (
                                <Card 
                                    key={machine.id} 
                                    className="border-border/50 shadow-sm rounded-[2.5rem] overflow-hidden bg-white hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full cursor-pointer"
                                >
                                    <div className="relative h-48 bg-muted/30 overflow-hidden flex items-center justify-center">
                                        <Wrench size={64} className="text-muted-foreground/20" />
                                        <div className="absolute top-4 right-4">
                                            <Badge className={`rounded-lg font-bold text-[10px] shadow-lg ${
                                                machine.status === 'active' ? 'bg-success text-white' : 'bg-destructive text-white'
                                            }`}>
                                                {machine.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-8 flex flex-col flex-1">
                                        <div className="mb-2 flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-[10px] font-bold uppercase text-primary/60 tracking-widest">{machine.brand || 'No Brand'}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground">{machine.code}</p>
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{machine.name}</h3>
                                            
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                                                    <Tag size={14} className="text-warning" /> {machine.type}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                                                    <CircleDollarSign size={14} className="text-primary" /> Rp{Number(machine.hourly_rate).toLocaleString('id-ID')}/jam
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                                                <MapPin size={14} /> {machine.location || '-'}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="bg-muted/30 border-b border-border/30 p-10">
                        <DialogTitle className="text-2xl font-bold tracking-tight text-primary">
                            Tambah Mesin Reservasi
                        </DialogTitle>
                        <DialogDescription className="font-medium text-sm">Daftarkan mesin baru yang dapat disewakan.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="p-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs font-bold text-muted-foreground ml-1">Nama Mesin</Label>
                                    <Input 
                                        value={form.name}
                                        onChange={(e) => setForm({...form, name: e.target.value})}
                                        placeholder="Contoh: CNC Milling Haas 3-Axis" 
                                        className="h-12 rounded-2xl bg-muted/20 border-transparent focus:bg-background transition-all font-bold" 
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground ml-1">Kode Mesin (Unik)</Label>
                                    <Input 
                                        value={form.code}
                                        onChange={(e) => setForm({...form, code: e.target.value})}
                                        placeholder="CNC-001" 
                                        className="h-12 rounded-2xl bg-muted/20 border-transparent focus:bg-background transition-all font-bold" 
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground ml-1">Brand / Merk</Label>
                                    <Input 
                                        value={form.brand}
                                        onChange={(e) => setForm({...form, brand: e.target.value})}
                                        placeholder="Haas" 
                                        className="h-12 rounded-2xl bg-muted/20 border-transparent focus:bg-background transition-all font-bold" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground ml-1">Tipe Mesin</Label>
                                    <Select 
                                        value={form.type} 
                                        onValueChange={(val) => setForm({...form, type: val})}
                                    >
                                        <SelectTrigger className="h-12 rounded-2xl bg-muted/20 border-transparent focus:bg-background">
                                            <SelectValue placeholder="Pilih Tipe" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl">
                                            <SelectItem value="CNC" className="rounded-xl">CNC</SelectItem>
                                            <SelectItem value="Laser" className="rounded-xl">Laser Cutting</SelectItem>
                                            <SelectItem value="3D Printer" className="rounded-xl">3D Printer</SelectItem>
                                            <SelectItem value="Other" className="rounded-xl">Lainnya</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground ml-1">Harga Sewa per Jam (Rp)</Label>
                                    <Input 
                                        type="number"
                                        value={form.hourly_rate}
                                        onChange={(e) => setForm({...form, hourly_rate: e.target.value})}
                                        placeholder="150000" 
                                        className="h-12 rounded-2xl bg-muted/20 border-transparent focus:bg-background transition-all font-bold" 
                                        required
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs font-bold text-muted-foreground ml-1">Lokasi Mesin</Label>
                                    <Input 
                                        value={form.location}
                                        onChange={(e) => setForm({...form, location: e.target.value})}
                                        placeholder="Lab CNC Polman" 
                                        className="h-12 rounded-2xl bg-muted/20 border-transparent focus:bg-background transition-all font-bold" 
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs font-bold text-muted-foreground ml-1">Deskripsi Spesifikasi</Label>
                                    <Textarea 
                                        value={form.description}
                                        onChange={(e) => setForm({...form, description: e.target.value})}
                                        placeholder="Detail kemampuan mesin..."
                                        className="rounded-2xl bg-muted/20 border-transparent focus:bg-background transition-all h-24 resize-none font-medium" 
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="p-10 pt-0">
                            <Button type="submit" disabled={submitting} className="w-full h-14 rounded-2xl font-bold gap-2 shadow-lg shadow-primary/20 bg-primary">
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Daftarkan Mesin
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardPageShell>
    );
}
