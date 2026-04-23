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
  Building2,
  Tag,
  MapPin,
  CircleDollarSign,
  AlertCircle,
  CheckCircle2,
  X
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { DashboardPageShell } from "@/src/components/layouts/dashboard/DashboardPageShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/src/components/ui/table";
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
    const [editingMachine, setEditingMachine] = useState<any>(null);
    const [userContext, setUserContext] = useState<any>(null);
    const [status, setStatus] = useState<{ type: "success" | "destructive"; message: string } | null>(null);

    const [form, setForm] = useState({
        name: "",
        code: "",
        type: "Bubut",
        brand: "",
        description: "",
        location: "",
        hourly_rate: "0",
        owner_id: "",
        owner_type: "umkm"
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const userRes = await api.get("/v1/me");
            const userData = userRes.data.data?.user || userRes.data.user;
            setUserContext(userData);

            const machRes = await api.get("/v1/machines");
            const myMachines = machRes.data.data.filter((m: any) => 
                (userData.umkm && m.owner_id === userData.umkm.id && m.owner_entity_type === 'umkm') ||
                ((userData.institutions || userData.organizations || []).some((o: any) => o.id === m.owner_id) && m.owner_entity_type === 'institution')
            );
            setMachines(myMachines);
        } catch (err) {
            console.error("Gagal mengambil katalog mesin:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const openDialog = (machine?: any) => {
        if (machine) {
            setEditingMachine(machine);
            setForm({
                name: machine.name,
                code: machine.code,
                type: machine.type,
                brand: machine.brand || "",
                description: machine.description || "",
                location: machine.location || "",
                hourly_rate: machine.hourly_rate.toString(),
                owner_id: machine.owner_id.toString(),
                owner_type: machine.owner_entity_type || (machine.owner_type.toLowerCase().includes('umkm') ? 'umkm' : 'institution')
            });
        } else {
            setEditingMachine(null);
            const defaultOwnerId = userContext?.umkm?.id || userContext?.institutions?.[0]?.id || userContext?.organizations?.[0]?.id || "";
            const defaultOwnerType = userContext?.umkm ? 'umkm' : 'institution';
            
            setForm({
                name: "",
                code: "",
                type: "Bubut",
                brand: "",
                description: "",
                location: "",
                hourly_rate: "0",
                owner_id: defaultOwnerId.toString(),
                owner_type: defaultOwnerType
            });
        }
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus(null);
        try {
            if (editingMachine) {
                setStatus({ type: "destructive", message: "Update feature is coming soon to the API." });
            } else {
                await api.post("/v1/machines", form);
                setStatus({ type: "success", message: "Machine added to catalog successfully." });
            }
            setDialogOpen(false);
            fetchData();
        } catch (err: any) {
            setStatus({ type: "destructive", message: err.response?.data?.message || "Failed to save machine." });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Hapus mesin ini dari katalog?")) return;
        setStatus(null);
        try {
            await api.delete(`/v1/machines/${id}`);
            setStatus({ type: "success", message: "Machine removed from catalog." });
            fetchData();
        } catch (err: any) {
            setStatus({ type: "destructive", message: "Failed to delete machine." });
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
            title="Katalog Mesin Industri"
            subtitle="Kelola aset mesin produksi yang Anda miliki untuk dibagikan atau digunakan sendiri."
            icon={Package}
            actions={
                <Button onClick={() => openDialog()} className="gap-2 rounded-xl font-bold h-11 shadow-lg shadow-primary/20">
                    <Plus size={18} /> Tambah Mesin
                </Button>
            }
        >
            <div className="space-y-6">
                {status && (
                    <Alert variant={status.type} className="animate-in fade-in slide-in-from-top-2 duration-300">
                        {status.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        <AlertDescription className="flex items-center justify-between">
                            {status.message}
                            <button onClick={() => setStatus(null)} className="ml-4">
                                <X size={16} className="opacity-50 hover:opacity-100" />
                            </button>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 gap-6">
                    {machines.length === 0 ? (
                        <Card className="border-dashed border-2 bg-muted/10 py-20 text-center">
                            <CardContent className="space-y-4">
                                <Wrench size={48} className="mx-auto text-muted-foreground opacity-30" />
                                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Belum ada mesin di katalog Anda.</p>
                                <Button onClick={() => openDialog()} variant="outline" className="rounded-xl font-bold">Mulai Tambah Aset</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {machines.map((machine) => (
                                <Card key={machine.id} className="border-border/50 shadow-sm rounded-[2rem] overflow-hidden bg-white hover:border-primary/30 transition-all group">
                                    <div className="bg-muted/30 p-6 flex justify-between items-start">
                                        <div className="p-3 rounded-2xl bg-white shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <Wrench size={24} />
                                        </div>
                                        <Badge variant={machine.is_available ? "default" : "secondary"} className="rounded-lg font-black uppercase text-[9px]">
                                            {machine.is_available ? 'Ready' : 'Busy'}
                                        </Badge>
                                    </div>
                                    <CardContent className="p-6 pt-2">
                                        <div className="mb-4">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{machine.type}</p>
                                            <h3 className="text-xl font-extrabold text-mango-blue line-clamp-1">{machine.name}</h3>
                                        </div>
                                        
                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                                <Tag size={14} className="text-primary" /> {machine.brand || 'No Brand'}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                                <MapPin size={14} className="text-primary" /> {machine.location || 'Workshop'}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                                                <CircleDollarSign size={14} className="text-success" /> 
                                                Rp {new Intl.NumberFormat().format(machine.hourly_rate)} <span className="text-[10px] text-muted-foreground">/ jam</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button onClick={() => openDialog(machine)} variant="outline" className="flex-1 rounded-xl h-10 font-bold gap-2">
                                                <Pencil size={14} /> Edit
                                            </Button>
                                            <Button onClick={() => handleDelete(machine.id)} variant="ghost" className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-lg rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="bg-muted/30 border-b p-8">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight text-mango-blue">
                            {editingMachine ? "Modifikasi Aset" : "Daftarkan Mesin Baru"}
                        </DialogTitle>
                        <DialogDescription className="font-medium">Identitas aset produksi yang akan dipublikasikan ke katalog.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="p-8 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nama Mesin</Label>
                                    <Input 
                                        value={form.name}
                                        onChange={(e) => setForm({...form, name: e.target.value})}
                                        placeholder="Contoh: Mesin CNC Laser 3000" 
                                        className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all font-bold" 
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kode / Seri</Label>
                                    <Input 
                                        value={form.code}
                                        onChange={(e) => setForm({...form, code: e.target.value})}
                                        placeholder="CNC-001" 
                                        className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all" 
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tipe Mesin</Label>
                                    <Select 
                                        value={form.type} 
                                        onValueChange={(val) => setForm({...form, type: val})}
                                    >
                                        <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Bubut">Bubut</SelectItem>
                                            <SelectItem value="Milling">Milling</SelectItem>
                                            <SelectItem value="CNC">CNC</SelectItem>
                                            <SelectItem value="Laser">Laser</SelectItem>
                                            <SelectItem value="Sablon">Sablon</SelectItem>
                                            <SelectItem value="Lainnya">Lainnya</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Brand / Merk</Label>
                                    <Input 
                                        value={form.brand}
                                        onChange={(e) => setForm({...form, brand: e.target.value})}
                                        placeholder="Contoh: Mitsubishi" 
                                        className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tarif / Jam (Rp)</Label>
                                    <Input 
                                        type="number"
                                        value={form.hourly_rate}
                                        onChange={(e) => setForm({...form, hourly_rate: e.target.value})}
                                        placeholder="0" 
                                        className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all font-bold" 
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Lokasi Workshop</Label>
                                <Input 
                                    value={form.location}
                                    onChange={(e) => setForm({...form, location: e.target.value})}
                                    placeholder="Alamat atau nama gedung workshop" 
                                    className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all" 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Deskripsi Spesifikasi</Label>
                                <Textarea 
                                    value={form.description}
                                    onChange={(e) => setForm({...form, description: e.target.value})}
                                    placeholder="Jelaskan spesifikasi teknis mesin Anda..."
                                    className="rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all h-24 resize-none" 
                                />
                            </div>
                        </CardContent>
                        <DialogFooter className="p-8 pt-0">
                            <Button type="submit" disabled={submitting} className="w-full h-12 rounded-xl font-black uppercase text-xs tracking-widest gap-2 shadow-lg shadow-primary/20">
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Simpan ke Katalog
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardPageShell>
    );
}
