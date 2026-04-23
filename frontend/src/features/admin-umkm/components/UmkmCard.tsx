"use client";

import React from "react";
import { Store, User as UserIcon, Calendar, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";

interface UmkmCardProps {
  umkm: any;
  onViewAnalysis: (id: number) => void;
}

export const UmkmCard = ({ umkm, onViewAnalysis }: UmkmCardProps) => {
  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden group bg-white">
      <CardHeader className="bg-muted/30 pb-4 border-b border-border/30">
        <div className="flex justify-between items-start">
          <Badge variant={umkm.is_active ? "default" : "secondary"} className="rounded-md text-[9px] font-black uppercase tracking-tight">
            {umkm.is_active ? "Aktif" : "Nonaktif"}
          </Badge>
          <div className="p-2 rounded-lg bg-white shadow-sm text-primary">
            <Store size={14} />
          </div>
        </div>
        <div className="pt-2">
          <CardTitle className="text-lg font-bold text-mango-blue uppercase tracking-tight truncate">{umkm.name}</CardTitle>
          <CardDescription className="flex items-center gap-1.5 font-bold text-muted-foreground uppercase text-[10px] tracking-widest mt-1">
            <UserIcon size={12} className="text-primary" /> {umkm.owner_name}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sektor</p>
            <p className="text-xs font-bold text-foreground">{umkm.sector}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Staff</p>
            <p className="text-xs font-bold text-foreground">{umkm.employee_count} Orang</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-border/50 flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase">
            <Calendar size={12} /> {umkm.established_year}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onViewAnalysis(umkm.id)}
            className="h-8 text-primary hover:text-mango-hover font-black uppercase text-[10px] gap-1.5 px-3 rounded-xl hover:bg-primary/5"
          >
            Analysis <Activity size={12} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
