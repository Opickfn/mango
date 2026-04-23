"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/src/lib/http/axios";
import { 
  Loader2, 
  Wrench,
  AlertCircle,
  Plus,
  Trash2,
  Pencil,
  Factory,
  Settings2,
  Building2,
  Save,
  X,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { DashboardPageShell } from "@/src/components/layouts/dashboard/DashboardPageShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { Badge } from "@/src/components/ui/badge";
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
import { Textarea } from "@/src/components/ui/textarea";

export default function TechnicalProfilePage() {
    const [umkm, setUmkm] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    const [capacities, setCapacities] = useState<any[]>([]);
    const [machines, setMachines] = useState<any[]>([]);
    
    const [capacityDialogOpen, setCapacityDialogOpen] = useState(false);
    const [machineDialogOpen, setMachineDialogOpen] = useState(false);
    
    const [editingCapacity, setEditingCapacity] = useState<any>(null);
    const [editingMachine, setEditingMachine] = useState<any>(null);
    
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "destructive"; message: string } | null>(null);

    const [capacityForm, setCapacityForm] = useState({
        product_name: "",
        capacity_per_day: "",
        unit: "",
        notes: ""
    });

    const [machineForm, setMachineForm] = useState({
        machine_name: "",
        brand: "",
        quantity: "1",
        condition: "good",
        notes: ""
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const userRes = await api.get("/v1/me");
            const userData = userRes.data.data?.user || userRes.data.user || userRes.data;
            
            if (userData.umkm) {
                setUmkm(userData.umkm);
                
                const [capRes, machRes] = await Promise.all([
                    api.get("/v1/production-capacities"),
                    api.get("/v1/machine-manuals")
                ]);
                
                setCapacities(capRes.data.data || capRes.data);
                setMachines(machRes.data.data || machRes.data);
            }
        } catch (err) {
            console.error("Gagal mengambil data teknis:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleCapacitySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!umkm) return;
        setSubmitting(true);
        setStatus(null);
        try {
            if (editingCapacity) {
                await api.put(`/v1/production-capacities/${editingCapacity.id}`, capacityForm);
                setStatus({ type: "success", message: "Production capacity updated successfully." });
            } else {
                await api.post("/v1/production-capacities", capacityForm);
                setStatus({ type: "success", message: "Production capacity added successfully." });
            }
            setCapacityDialogOpen(false);
            fetchData();
        } catch (err: any) {
            setStatus({ type: "destructive", message: err.response?.data?.message || "Failed to save data." });
        } finally {
            setSubmitting(false);
        }
    };

    const handleMachineSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!umkm) return;
        setSubmitting(true);
        setStatus(null);
        try {
            if (editingMachine) {
                await api.put(`/v1/machine-manuals/${editingMachine.id}`, machineForm);
                setStatus({ type: "success", message: "Machine entry updated successfully." });
            } else {
                await api.post("/v1/machine-manuals", machineForm);
                setStatus({ type: "success", message: "Machine entry added successfully." });
            }
            setMachineDialogOpen(false);
            fetchData();
        } catch (err: any) {
            setStatus({ type: "destructive", message: err.response?.data?.message || "Failed to save data." });
        } finally {
            setSubmitting(false);
        }
    };

    const deleteCapacity = async (id: number) => {
        if (!confirm("Hapus data kapasitas ini?")) return;
        setStatus(null);
        try {
            await api.delete(`/v1/production-capacities/${id}`);
            setStatus({ type: "success", message: "Production capacity deleted." });
            fetchData();
        } catch (err: any) {
            setStatus({ type: "destructive", message: err.response?.data?.message || "Failed to delete data." });
        }
    };

    const deleteMachine = async (id: number) => {
        if (!confirm("Hapus data mesin ini?")) return;
        setStatus(null);
        try {
            await api.delete(`/v1/machine-manuals/${id}`);
            setStatus({ type: "success", message: "Machine entry deleted." });
            fetchData();
        } catch (err: any) {
            setStatus({ type: "destructive", message: err.response?.data?.message || "Failed to delete data." });
        }
    };

    const openCapacityDialog = (item?: any) => {
        if (item) {
            setEditingCapacity(item);
            setCapacityForm({
                product_name: item.product_name,
                capacity_per_day: item.capacity_per_day.toString(),
                unit: item.unit,
                notes: item.notes || ""
            });
        } else {
            setEditingCapacity(null);
            setCapacityForm({
                product_name: "",
                capacity_per_day: "",
                unit: "",
                notes: ""
            });
        }
        setCapacityDialogOpen(true);
    };

    const openMachineDialog = (item?: any) => {
        if (item) {
            setEditingMachine(item);
            setMachineForm({
                machine_name: item.machine_name,
                brand: item.brand || "",
                quantity: item.quantity.toString(),
                condition: item.condition,
                notes: item.notes || ""
            });
        } else {
            setEditingMachine(null);
            setMachineForm({
                machine_name: "",
                brand: "",
                quantity: "1",
                condition: "good",
                notes: ""
            });
        }
        setMachineDialogOpen(true);
    };

    if (loading) return (
        <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">Menghubungkan ke pusat data teknis...</p>
        </div>
    );

    if (!umkm) return (
        <DashboardPageShell title="Profil Teknis" subtitle="Kapasitas & Fasilitas Produksi" icon={Wrench}>
            <Card className="border-dashed border-2 bg-muted/20 py-20 text-center">
                <CardContent className="space-y-4">
                    <AlertCircle size={48} className="mx-auto text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground font-medium">Lengkapi profil UMKM Anda terlebih dahulu untuk mengakses menu ini.</p>
                </CardContent>
            </Card>
        </DashboardPageShell>
    );

    return (
        <DashboardPageShell
            title="Profil Teknis Produksi"
            subtitle="Pusat manajemen kapasitas operasional dan aset permesinan UMKM."
            icon={Wrench}
        >
            <div className="space-y-8">
                {status && (
                    <Alert 
                        variant={status.type} 
                        className="animate-in fade-in slide-in-from-top-2 duration-300"
                    >
                        {status.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        <AlertDescription className="flex items-center justify-between">
                            {status.message}
                            <button 
                                onClick={() => setStatus(null)}
                                className="ml-4 text-xs font-bold uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity"
                            >
                                Close
                            </button>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 gap-8">
                    {/* Production Capacity Section */}
                    <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="bg-muted/30 border-b border-border/50 p-6 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <Factory size={18} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold text-mango-blue uppercase tracking-tight">Kapasitas Produksi</CardTitle>
                                    <CardDescription>Rincian volume output harian per jenis produk.</CardDescription>
                                </div>
                            </div>
                            <Button onClick={() => openCapacityDialog()} className="rounded-xl gap-2 font-bold bg-primary shadow-lg shadow-primary/20 h-10">
                                <Plus size={16} /> Tambah Data
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/10">
                                        <TableHead className="px-6 font-bold text-xs uppercase tracking-wider text-muted-foreground">Produk</TableHead>
                                        <TableHead className="px-6 font-bold text-xs uppercase tracking-wider text-muted-foreground">Volume Harian</TableHead>
                                        <TableHead className="px-6 font-bold text-xs uppercase tracking-wider text-muted-foreground">Catatan</TableHead>
                                        <TableHead className="px-6 text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {capacities.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-40 text-center text-muted-foreground italic">Belum ada data kapasitas produksi.</TableCell>
                                        </TableRow>
                                    ) : (
                                        capacities.map((item) => (
                                            <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                                                <TableCell className="px-6 py-4 font-bold text-foreground">{item.product_name}</TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <Badge variant="secondary" className="rounded-lg font-bold px-3 py-1">
                                                        {item.capacity_per_day} {item.unit} / hari
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-sm text-muted-foreground">{item.notes || "—"}</TableCell>
                                                <TableCell className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button onClick={() => openCapacityDialog(item)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                                                            <Pencil size={14} />
                                                        </Button>
                                                        <Button onClick={() => deleteCapacity(item.id)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all">
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Machine List Section */}
                    <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="bg-muted/30 border-b border-border/50 p-6 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-accent/10 text-accent">
                                    <Settings2 size={18} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold text-mango-blue uppercase tracking-tight">Daftar Permesinan</CardTitle>
                                    <CardDescription>Aset fisik dan peralatan pendukung produksi.</CardDescription>
                                </div>
                            </div>
                            <Button onClick={() => openMachineDialog()} className="rounded-xl gap-2 font-bold bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20 h-10">
                                <Plus size={16} /> Tambah Mesin
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/10">
                                        <TableHead className="px-6 font-bold text-xs uppercase tracking-wider text-muted-foreground">Nama Mesin</TableHead>
                                        <TableHead className="px-6 font-bold text-xs uppercase tracking-wider text-muted-foreground">Brand / Merk</TableHead>
                                        <TableHead className="px-6 font-bold text-xs uppercase tracking-wider text-muted-foreground">Qty</TableHead>
                                        <TableHead className="px-6 font-bold text-xs uppercase tracking-wider text-muted-foreground">Kondisi</TableHead>
                                        <TableHead className="px-6 text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {machines.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-40 text-center text-muted-foreground italic">Belum ada data permesinan.</TableCell>
                                        </TableRow>
                                    ) : (
                                        machines.map((item) => (
                                            <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                                                <TableCell className="px-6 py-4 font-bold text-foreground">{item.machine_name}</TableCell>
                                                <TableCell className="px-6 py-4 text-sm font-medium text-muted-foreground">{item.brand || "—"}</TableCell>
                                                <TableCell className="px-6 py-4 font-bold">{item.quantity} Unit</TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <Badge className={`rounded-lg font-black uppercase text-[9px] ${
                                                        item.condition === 'good' ? 'bg-success/10 text-success border-success/20' : 
                                                        item.condition === 'fair' ? 'bg-warning/10 text-warning border-warning/20' : 
                                                        'bg-destructive/10 text-destructive border-destructive/20'
                                                    }`}>
                                                        {item.condition === 'good' ? 'Prima' : item.condition === 'fair' ? 'Cukup' : 'Rusak'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button onClick={() => openMachineDialog(item)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                                                            <Pencil size={14} />
                                                        </Button>
                                                        <Button onClick={() => deleteMachine(item.id)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all">
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Capacity Dialog */}
            <Dialog open={capacityDialogOpen} onOpenChange={setCapacityDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="bg-muted/30 border-b p-6">
                        <DialogTitle className="text-xl font-black uppercase tracking-tight text-mango-blue">
                            {editingCapacity ? "Edit Kapasitas" : "Tambah Kapasitas"}
                        </DialogTitle>
                        <DialogDescription className="font-medium text-xs">Informasi volume produksi harian UMKM.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCapacitySubmit} className="p-6 space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nama Produk</Label>
                                <Input 
                                    value={capacityForm.product_name}
                                    onChange={(e) => setCapacityForm({...capacityForm, product_name: e.target.value})}
                                    placeholder="Contoh: Kemeja Flanel" 
                                    className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all font-bold" 
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Harian</Label>
                                    <Input 
                                        type="number"
                                        value={capacityForm.capacity_per_day}
                                        onChange={(e) => setCapacityForm({...capacityForm, capacity_per_day: e.target.value})}
                                        placeholder="0" 
                                        className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all" 
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Satuan</Label>
                                    <Input 
                                        value={capacityForm.unit}
                                        onChange={(e) => setCapacityForm({...capacityForm, unit: e.target.value})}
                                        placeholder="Pcs/Lusin" 
                                        className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all" 
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Catatan (Opsional)</Label>
                                <Textarea 
                                    value={capacityForm.notes}
                                    onChange={(e) => setCapacityForm({...capacityForm, notes: e.target.value})}
                                    className="rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all resize-none h-20" 
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="submit" disabled={submitting} className="w-full h-12 rounded-xl font-black uppercase text-xs tracking-widest gap-2 bg-primary">
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Simpan Data Kapasitas
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Machine Dialog */}
            <Dialog open={machineDialogOpen} onOpenChange={setMachineDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="bg-muted/30 border-b p-6">
                        <DialogTitle className="text-xl font-black uppercase tracking-tight text-mango-blue">
                            {editingMachine ? "Edit Data Mesin" : "Tambah Mesin"}
                        </DialogTitle>
                        <DialogDescription className="font-medium text-xs">Informasi aset peralatan produksi.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleMachineSubmit} className="p-6 space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nama Alat / Mesin</Label>
                                <Input 
                                    value={machineForm.machine_name}
                                    onChange={(e) => setMachineForm({...machineForm, machine_name: e.target.value})}
                                    placeholder="Contoh: Mesin Jahit Juki" 
                                    className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all font-bold" 
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Brand / Merk</Label>
                                    <Input 
                                        value={machineForm.brand}
                                        onChange={(e) => setMachineForm({...machineForm, brand: e.target.value})}
                                        placeholder="Penyedia/Merk" 
                                        className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Jumlah Unit</Label>
                                    <Input 
                                        type="number"
                                        value={machineForm.quantity}
                                        onChange={(e) => setMachineForm({...machineForm, quantity: e.target.value})}
                                        placeholder="1" 
                                        className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all" 
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kondisi Saat Ini</Label>
                                <Select 
                                    value={machineForm.condition} 
                                    onValueChange={(val) => setMachineForm({...machineForm, condition: val})}
                                >
                                    <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all">
                                        <SelectValue placeholder="Pilih Kondisi" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-border/50">
                                        <SelectItem value="good" className="rounded-lg">Prima / Beroperasi Baik</SelectItem>
                                        <SelectItem value="fair" className="rounded-lg">Cukup / Butuh Servis</SelectItem>
                                        <SelectItem value="poor" className="rounded-lg">Rusak / Tidak Beroperasi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="submit" disabled={submitting} className="w-full h-12 rounded-xl font-black uppercase text-xs tracking-widest gap-2 bg-accent hover:bg-accent/90">
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Simpan Inventaris Mesin
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardPageShell>
    );
}
