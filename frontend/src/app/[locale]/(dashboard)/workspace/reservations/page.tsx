"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/src/lib/http/axios";
import {
    Loader2,
    Wrench,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    Plus,
    MapPin,
    Building2,
    Save,
    Tag,
    X
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { DashboardPageShell } from "@/src/components/layouts/dashboard/DashboardPageShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";

export default function MachineReservationPage() {
    const [machines, setMachines] = useState<any[]>([]);
    const [myReservations, setMyReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userContext, setUserContext] = useState<any>(null);

    const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
    const [selectedMachine, setSelectedMachine] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "destructive"; message: string } | null>(null);

    const [form, setForm] = useState({
        start_time: "",
        end_time: "",
        purpose: ""
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [userRes, machRes, resRes] = await Promise.all([
                api.get("/v1/me"),
                api.get("/v1/machines"),
                api.get("/v1/machines/reservations/all")
            ]);
            const userData = userRes.data.data?.user || userRes.data.user;
            setUserContext(userData);

            const ownerType = userData.roles?.includes('upt') ? 'App\\Models\\Master\\Organization' : 'App\\Models\\Umkm\\Umkm';
            const ownerId = userData.roles?.includes('upt') ? userData.organizations?.[0]?.id : userData.umkm?.id;

            const processedMachines = machRes.data.data?.map((m: any) => ({
                ...m,
                is_mine: m.owner_type === ownerType && m.owner_id === ownerId
            })) || [];

            setMachines(processedMachines);
            setMyReservations(resRes.data.data);
        } catch (err) {
            console.error("Gagal mengambil data reservasi:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleReserve = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus(null);
        try {
            await api.post("/v1/machines/reservations", {
                ...form,
                machine_id: selectedMachine.id
            });
            setStatus({ type: "success", message: "Reservation request submitted successfully." });
            setReservationDialogOpen(false);
            fetchData();
        } catch (err: any) {
            setStatus({ type: "destructive", message: err.response?.data?.message || "Failed to create reservation." });
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <Badge variant="secondary" className="rounded-lg font-black uppercase text-[10px]">Menunggu</Badge>;
            case 'approved': return <Badge className="bg-success/10 text-success border-success/20 rounded-lg font-black uppercase text-[10px]">Disetujui</Badge>;
            case 'rejected': return <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 rounded-lg font-black uppercase text-[10px]">Ditolak</Badge>;
            default: return <Badge variant="outline" className="rounded-lg font-black uppercase text-[10px]">{status}</Badge>;
        }
    };

    if (loading) return (
        <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">Menghubungkan ke jadwal permesinan...</p>
        </div>
    );

    return (
        <DashboardPageShell
            title="Reservasi Permesinan"
            subtitle="Pinjam fasilitas produksi untuk kebutuhan IKM Anda."
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

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* Machines List */}
                    <div className="xl:col-span-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Building2 size={18} />
                            </div>
                            <h2 className="text-lg font-bold text-primary uppercase tracking-tight">Katalog Fasilitas Tersedia</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {machines.map((machine) => (
                                <Card key={machine.id} className="border-border/50 shadow-sm rounded-3xl hover:border-primary/30 transition-all group overflow-hidden bg-white">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 rounded-2xl bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <Wrench size={24} />
                                            </div>
                                            <div className="flex gap-2">
                                                {machine.is_mine && (
                                                    <Badge className="bg-primary/10 text-primary border-primary/20 rounded-lg font-black uppercase text-[9px]">
                                                        Milik Anda
                                                    </Badge>
                                                )}
                                                <Badge variant={machine.is_available ? "default" : "secondary"} className="rounded-lg font-black uppercase text-[9px]">
                                                    {machine.is_available ? 'Tersedia' : 'Sibuk'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">{machine.name}</h3>
                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                                <Tag size={14} className="text-primary" />
                                                {machine.type}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                                <MapPin size={14} className="text-primary" />
                                                Lab {machine.department?.name || 'Workshop'}
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => {
                                                setSelectedMachine(machine);
                                                setReservationDialogOpen(true);
                                            }}
                                            disabled={!machine.is_available || machine.is_mine}
                                            className="w-full rounded-xl font-bold h-10 gap-2"
                                        >
                                            {machine.is_mine ? 'Milik Anda' : (machine.is_available ? 'Pesan Sekarang' : 'Tidak Tersedia')}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* My Reservations */}
                    <div className="xl:col-span-4 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-accent/10 text-accent">
                                <Clock size={18} />
                            </div>
                            <h2 className="text-lg font-bold text-primary uppercase tracking-tight">Status Pesanan Saya</h2>
                        </div>

                        <div className="space-y-4">
                            {myReservations.length === 0 ? (
                                <Card className="border-dashed border-2 bg-muted/10 py-10 text-center">
                                    <CardContent>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest italic">Belum ada riwayat pesanan.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                myReservations.map((res) => (
                                    <Card key={res.id} className="border-border/50 shadow-sm rounded-2xl bg-white overflow-hidden">
                                        <div className="bg-muted/30 px-4 py-2 border-b border-border/50 flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">ID: #{res.id}</span>
                                            {getStatusBadge(res.status)}
                                        </div>
                                        <CardContent className="p-4 space-y-3">
                                            <p className="font-bold text-sm text-foreground">{res.machine?.name}</p>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                                    <Calendar size={12} className="text-primary" />
                                                    {new Date(res.start_time).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                                    <Clock size={12} className="text-primary" />
                                                    {new Date(res.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(res.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reservation Dialog */}
            <Dialog open={reservationDialogOpen} onOpenChange={setReservationDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="bg-muted/30 border-b p-6">
                        <DialogTitle className="text-xl font-black uppercase tracking-tight text-primary">Form Reservasi</DialogTitle>
                        <DialogDescription className="font-medium text-xs">
                            Mengajukan peminjaman: <span className="text-primary font-bold">{selectedMachine?.name}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleReserve} className="p-6 space-y-5">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Waktu Mulai</Label>
                                    <Input
                                        type="datetime-local"
                                        value={form.start_time}
                                        onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                                        className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Waktu Selesai</Label>
                                    <Input
                                        type="datetime-local"
                                        value={form.end_time}
                                        onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                                        className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tujuan Penggunaan</Label>
                                <Textarea
                                    value={form.purpose}
                                    onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                                    placeholder="Jelaskan secara singkat target produksi Anda..."
                                    className="rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all resize-none h-24"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="submit" disabled={submitting} className="w-full h-12 rounded-xl font-black uppercase text-xs tracking-widest gap-2 bg-primary shadow-lg shadow-primary/20">
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Kirim Permohonan Pesanan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardPageShell>
    );
}
