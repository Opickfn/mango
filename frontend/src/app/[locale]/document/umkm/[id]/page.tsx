"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/src/lib/http/axios";
import { Loader2, Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

// ─── Design tokens ────────────────────────────────────
const C = {
    primary:   "#1e477e",
    hover:     "#153460",
    accent:    "#f97316",
    success:   "#22c55e",
    warning:   "#f59e0b",
    danger:    "#ef4444",
    fg:        "#0f172a",
    muted:     "#64748b",
    border:    "#e2e8f0",
    bg:        "#f8fafc",
    white:     "#ffffff",
};

export default function UmkmResumeDocumentPage() {
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState<string | null>(null);
    
    const [umkm, setUmkm] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [capacities, setCapacities] = useState<any[]>([]);
    const [machines, setMachines] = useState<any[]>([]);

    useEffect(() => {
        if (!id) return;
        
        const fetchResumeData = async () => {
            try {
                // Determine if we are fetching current user's UMKM or specific ID
                const umkmId = id === "me" ? null : id;
                let actualId = umkmId;

                if (!actualId) {
                    const meRes = await api.get("/v1/me");
                    actualId = meRes.data.data?.user?.umkm?.id || meRes.data.user?.umkm?.id;
                    if (!actualId) throw new Error("Anda belum memiliki UMKM terdaftar.");
                }

                const [umkmRes, profileRes, capRes, machRes] = await Promise.allSettled([
                    api.get(`/v1/umkm/${actualId}`),
                    api.get(`/v1/umkm/${actualId}/profile`),
                    api.get(`/v1/umkm/${actualId}/production-capacities`),
                    api.get(`/v1/umkm/${actualId}/machine-manuals`)
                ]);

                if (umkmRes.status === "fulfilled") {
                    setUmkm(umkmRes.value.data.data || umkmRes.value.data);
                } else {
                    throw new Error("Gagal memuat data utama UMKM.");
                }

                if (profileRes.status === "fulfilled") setProfile(profileRes.value.data.data || profileRes.value.data);
                if (capRes.status === "fulfilled") setCapacities(capRes.value.data.data || capRes.value.data);
                if (machRes.status === "fulfilled") setMachines(machRes.value.data.data || machRes.value.data);

            } catch (e: any) {
                setError(e.message || "Gagal memuat dokumen resume.");
            } finally {
                setLoading(false);
            }
        };

        fetchResumeData();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-[#1e477e]" size={36} />
                <p className="text-sm font-semibold text-slate-500">Menyusun resume...</p>
            </div>
        </div>
    );

    if (error || !umkm) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center space-y-3">
                <p className="text-red-500 font-bold">{error || "Data tidak ditemukan."}</p>
                <button onClick={() => window.close()} className="text-sm text-blue-600 underline">← Kembali</button>
            </div>
        </div>
    );

    const docNo  = `RES-${String(umkm.id).padStart(6, "0")}`;
    const issued = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                * { box-sizing: border-box; }
                body { font-family: 'Inter', sans-serif; background: ${C.bg}; margin: 0; }
                @media print {
                    body { background: white; }
                    .no-print { display: none !important; }
                    .invoice-page { box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; }
                    @page { size: A4 portrait; margin: 10mm; }
                }
            `}</style>

            {/* Top bar (screen only) */}
            <div className="no-print sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
                <button onClick={() => window.close()} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                    <ArrowLeft size={16} /> Tutup
                </button>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.hover})` }}
                >
                    <Printer size={15} /> Cetak / Simpan PDF
                </button>
            </div>

            {/* Document wrapper */}
            <div className="py-8 px-4 min-h-screen" style={{ background: C.bg }}>
                <div
                    className="invoice-page mx-auto bg-white rounded-3xl overflow-hidden"
                    style={{
                        maxWidth: "794px",
                        boxShadow: "0 20px 60px rgba(30,71,126,0.12), 0 4px 16px rgba(0,0,0,0.06)",
                    }}
                >
                    {/* ── HEADER BANNER ────────────────────────────────────── */}
                    <div
                        style={{
                            background: `linear-gradient(135deg, ${C.primary} 0%, ${C.hover} 60%, #0f2848 100%)`,
                            padding: "36px 40px 32px",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />
                        <div style={{ position:"absolute", bottom:-60, right:80, width:220, height:220, borderRadius:"50%", background:"rgba(249,115,22,0.12)" }} />

                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", position:"relative" }}>
                            <div>
                                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                                    <div style={{
                                        background:"rgba(255,255,255,0.15)", borderRadius:12, width:44, height:44,
                                        display:"flex", alignItems:"center", justifyContent:"center",
                                        fontSize:18, fontWeight:900, color:"white", letterSpacing:-1,
                                    }}>M</div>
                                    <span style={{ fontSize:26, fontWeight:900, color:"white", letterSpacing:-1 }}>MANGO</span>
                                </div>
                                <p style={{ color:"rgba(255,255,255,0.65)", fontSize:11, fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase" }}>
                                    Platform IKM Digital · Resume UMKM
                                </p>
                            </div>
                            <div style={{ textAlign:"right" }}>
                                <p style={{ color:"rgba(255,255,255,0.55)", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", marginBottom:4 }}>
                                    Resume Profil Bisnis
                                </p>
                                <p style={{ color:"white", fontSize:22, fontWeight:900, letterSpacing:-0.5, marginBottom:2 }}>{docNo}</p>
                                <p style={{ color:"rgba(255,255,255,0.65)", fontSize:11 }}>Tanggal Cetak: {issued}</p>
                            </div>
                        </div>
                    </div>

                    {/* ── CONTENT ──────────────────────────────────────────── */}
                    <div style={{ padding:"36px 40px" }}>
                        
                        {/* 1. BASIC INFO */}
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, paddingBottom:16, borderBottom:`2px solid ${C.border}` }}>
                            <div>
                                <h1 style={{ fontSize:28, fontWeight:900, color:C.primary, marginBottom:4, textTransform:"uppercase" }}>{umkm.name}</h1>
                                <p style={{ fontSize:13, color:C.muted, fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase" }}>
                                    Pemilik: <span style={{ color:C.fg }}>{umkm.owner_name}</span>
                                </p>
                            </div>
                            <div style={{ background:"rgba(34,197,94,0.1)", color:C.success, padding:"6px 12px", borderRadius:8, fontSize:12, fontWeight:800, textTransform:"uppercase" }}>
                                {umkm.is_active ? "Status: AKTIF" : "Status: NONAKTIF"}
                            </div>
                        </div>

                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:32 }}>
                            <div style={{ background:C.bg, padding:16, borderRadius:12 }}>
                                <p style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:"uppercase", marginBottom:4 }}>Sektor Usaha</p>
                                <p style={{ fontSize:14, fontWeight:700, color:C.fg }}>{umkm.sector || "-"}</p>
                            </div>
                            <div style={{ background:C.bg, padding:16, borderRadius:12 }}>
                                <p style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:"uppercase", marginBottom:4 }}>Tahun Berdiri</p>
                                <p style={{ fontSize:14, fontWeight:700, color:C.fg }}>{umkm.established_year || "-"}</p>
                            </div>
                            <div style={{ background:C.bg, padding:16, borderRadius:12 }}>
                                <p style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:"uppercase", marginBottom:4 }}>Jml Karyawan</p>
                                <p style={{ fontSize:14, fontWeight:700, color:C.fg }}>{umkm.employee_count ? \`\${umkm.employee_count} Orang\` : "-"}</p>
                            </div>
                            <div style={{ background:C.bg, padding:16, borderRadius:12 }}>
                                <p style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:"uppercase", marginBottom:4 }}>NIB</p>
                                <p style={{ fontSize:14, fontWeight:700, color:C.fg }}>{umkm.nib || "-"}</p>
                            </div>
                            <div style={{ background:C.bg, padding:16, borderRadius:12, gridColumn:"span 2" }}>
                                <p style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:"uppercase", marginBottom:4 }}>Asal Organisasi / Pembina</p>
                                <p style={{ fontSize:14, fontWeight:700, color:C.fg }}>{umkm.organization?.name || "UMKM Mandiri"}</p>
                            </div>
                        </div>

                        {/* 2. STRATEGIC PROFILE */}
                        <div style={{ marginBottom:32 }}>
                            <h3 style={{ fontSize:14, fontWeight:800, color:C.primary, textTransform:"uppercase", letterSpacing:"1px", marginBottom:12, borderBottom:\`1px solid \${C.border}\`, paddingBottom:8 }}>Profil Strategis</h3>
                            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                                <div>
                                    <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", marginBottom:4 }}>Produk Unggulan</p>
                                    <p style={{ fontSize:13, color:C.fg, lineHeight:1.5 }}>{profile?.main_product || "Belum diisi"}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", marginBottom:4 }}>Target Pasar</p>
                                    <p style={{ fontSize:13, color:C.fg, lineHeight:1.5 }}>{profile?.market_target || "Belum diisi"}</p>
                                </div>
                            </div>
                        </div>

                        {/* 3. CAPACITIES */}
                        <div style={{ marginBottom:32 }}>
                            <h3 style={{ fontSize:14, fontWeight:800, color:C.primary, textTransform:"uppercase", letterSpacing:"1px", marginBottom:12, borderBottom:\`1px solid \${C.border}\`, paddingBottom:8 }}>Kapasitas Produksi</h3>
                            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                                <thead>
                                    <tr style={{ background:C.bg }}>
                                        <th style={{ padding:"10px 12px", textAlign:"left", borderBottom:\`1px solid \${C.border}\`, color:C.muted, textTransform:"uppercase", fontSize:10 }}>Produk</th>
                                        <th style={{ padding:"10px 12px", textAlign:"left", borderBottom:\`1px solid \${C.border}\`, color:C.muted, textTransform:"uppercase", fontSize:10 }}>Kapasitas Harian</th>
                                        <th style={{ padding:"10px 12px", textAlign:"left", borderBottom:\`1px solid \${C.border}\`, color:C.muted, textTransform:"uppercase", fontSize:10 }}>Catatan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {capacities.length === 0 ? (
                                        <tr><td colSpan={3} style={{ padding:"16px", textAlign:"center", color:C.muted, fontStyle:"italic" }}>Belum ada data kapasitas.</td></tr>
                                    ) : capacities.map((c, i) => (
                                        <tr key={i}>
                                            <td style={{ padding:"10px 12px", borderBottom:\`1px solid \${C.border}\`, fontWeight:700 }}>{c.product_name}</td>
                                            <td style={{ padding:"10px 12px", borderBottom:\`1px solid \${C.border}\` }}>{c.capacity_per_day} {c.unit}/hari</td>
                                            <td style={{ padding:"10px 12px", borderBottom:\`1px solid \${C.border}\`, color:C.muted }}>{c.notes || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 4. MACHINES */}
                        <div style={{ marginBottom:32 }}>
                            <h3 style={{ fontSize:14, fontWeight:800, color:C.primary, textTransform:"uppercase", letterSpacing:"1px", marginBottom:12, borderBottom:\`1px solid \${C.border}\`, paddingBottom:8 }}>Aset Permesinan</h3>
                            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                                <thead>
                                    <tr style={{ background:C.bg }}>
                                        <th style={{ padding:"10px 12px", textAlign:"left", borderBottom:\`1px solid \${C.border}\`, color:C.muted, textTransform:"uppercase", fontSize:10 }}>Nama Alat/Mesin</th>
                                        <th style={{ padding:"10px 12px", textAlign:"left", borderBottom:\`1px solid \${C.border}\`, color:C.muted, textTransform:"uppercase", fontSize:10 }}>Merk</th>
                                        <th style={{ padding:"10px 12px", textAlign:"center", borderBottom:\`1px solid \${C.border}\`, color:C.muted, textTransform:"uppercase", fontSize:10 }}>Jumlah</th>
                                        <th style={{ padding:"10px 12px", textAlign:"left", borderBottom:\`1px solid \${C.border}\`, color:C.muted, textTransform:"uppercase", fontSize:10 }}>Kondisi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {machines.length === 0 ? (
                                        <tr><td colSpan={4} style={{ padding:"16px", textAlign:"center", color:C.muted, fontStyle:"italic" }}>Belum ada data inventaris permesinan.</td></tr>
                                    ) : machines.map((m, i) => (
                                        <tr key={i}>
                                            <td style={{ padding:"10px 12px", borderBottom:\`1px solid \${C.border}\`, fontWeight:700 }}>{m.machine_name}</td>
                                            <td style={{ padding:"10px 12px", borderBottom:\`1px solid \${C.border}\` }}>{m.brand || "-"}</td>
                                            <td style={{ padding:"10px 12px", borderBottom:\`1px solid \${C.border}\`, textAlign:"center", fontWeight:700 }}>{m.quantity} Unit</td>
                                            <td style={{ padding:"10px 12px", borderBottom:\`1px solid \${C.border}\` }}>
                                                <span style={{ 
                                                    padding:"4px 8px", borderRadius:4, fontSize:10, fontWeight:700, textTransform:"uppercase",
                                                    background: m.condition === 'good' ? "rgba(34,197,94,0.1)" : m.condition === 'fair' ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)",
                                                    color: m.condition === 'good' ? C.success : m.condition === 'fair' ? C.warning : C.danger
                                                }}>
                                                    {m.condition === 'good' ? 'Prima' : m.condition === 'fair' ? 'Cukup' : 'Rusak'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                        {/* ── FOOTER ─────────────────────────────────────── */}
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginTop:40, paddingTop:24, borderTop:`1px solid ${C.border}` }}>
                            <div>
                                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                                    <div style={{ width:28, height:28, borderRadius:8, background:`linear-gradient(135deg, ${C.primary}, ${C.hover})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, color:"white" }}>M</div>
                                    <span style={{ fontWeight:800, fontSize:13, color:C.primary }}>MANGO</span>
                                </div>
                                <p style={{ fontSize:10, color:C.muted, lineHeight:1.6 }}>Dokumen resume resmi platform MANGO.<br />Dicetak otomatis oleh sistem.</p>
                            </div>
                        </div>

                        <div style={{ height:4, borderRadius:99, background:`linear-gradient(90deg, ${C.primary}, ${C.accent})`, marginTop:28 }} />
                    </div>
                </div>

                <div className="no-print" style={{ textAlign:"center", marginTop:24, marginBottom:32 }}>
                    <p style={{ fontSize:12, color:C.muted, marginBottom:12 }}>
                        Klik <strong>Cetak / Simpan PDF</strong> di atas, lalu pilih <em>"Save as PDF"</em> pada dialog cetak.
                    </p>
                </div>
            </div>
        </>
    );
}
