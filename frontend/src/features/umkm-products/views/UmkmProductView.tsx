"use client";

import React from "react";
import { 
    Package, Plus, Pencil, Trash2
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { DashboardPageShell } from "@/src/components/layouts/dashboard/DashboardPageShell";
import { StatusBadge } from "@/src/components/ui/dashboard/StatusBadge";
import { StatusAlert } from "@/src/components/ui/dashboard/StatusAlert";
import { LoadingState } from "@/src/components/ui/dashboard/LoadingSkeleton";
import { EmptyState } from "@/src/components/ui/dashboard/EmptyState";
import {
  AdminDataCard,
  AdminIconButton,
  AdminToolbar,
} from "@/src/components/ui/dashboard/AdminDataView";
import { 
  AdminTable, 
  AdminTableBody, 
  AdminTableCell, 
  AdminTableHeader, 
  AdminTableHeadCell,
  AdminTableRow, 
} from "@/src/components/ui/dashboard/AdminTable";
import { useUmkmProducts } from "../hooks/useUmkmProducts";
import { ProductDialogForm } from "../components/ProductDialogForm";
import { Badge } from "@/src/components/ui/badge";

export function UmkmProductView() {
  const {
    products,
    loading,
    submitting,
    isModalOpen,
    setIsModalOpen,
    editingProduct,
    form,
    onSubmit,
    handleDelete,
    openCreate,
    openEdit,
    status,
    setStatus,
    t,
  } = useUmkmProducts();

  return (
    <DashboardPageShell
      title={t("title")}
      subtitle={t("subtitle")}
      icon={Package}
      actions={
        <Button onClick={openCreate} className="gap-2">
          <Plus size={18} /> {t("add_product")}
        </Button>
      }
    >
      <div className="space-y-6">
        <StatusAlert status={status} onDismiss={() => setStatus(null)} />

        <AdminDataCard
          toolbar={
            <AdminToolbar>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted/50">
                        <Package size={18} className="text-muted-foreground" />
                    </div>
                    <h2 className="text-sm font-semibold text-foreground">{t("product_list")} ({products.length})</h2>
                </div>
            </AdminToolbar>
          }
        >
          {loading ? (
            <LoadingState message={t("loading")} />
          ) : products.length === 0 ? (
            <EmptyState icon={Package} title={t("empty_title")} description={t("empty_desc")} />
          ) : (
            <AdminTable>
              <AdminTableHeader>
                <AdminTableRow>
                  <AdminTableHeadCell>{t("table_product")}</AdminTableHeadCell>
                  <AdminTableHeadCell>{t("table_sku")}</AdminTableHeadCell>
                  <AdminTableHeadCell>{t("table_price")}</AdminTableHeadCell>
                  <AdminTableHeadCell>{t("table_status")}</AdminTableHeadCell>
                  <AdminTableHeadCell align="right">{t("table_actions")}</AdminTableHeadCell>
                </AdminTableRow>
              </AdminTableHeader>
              <AdminTableBody>
                {products.map((product) => (
                  <AdminTableRow key={product.id}>
                    <AdminTableCell>
                        <p className="font-medium text-foreground leading-tight">{product.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{product.unit}</p>
                    </AdminTableCell>
                    <AdminTableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                            {product.sku}
                        </Badge>
                    </AdminTableCell>
                    <AdminTableCell>
                        <p className="text-sm font-medium text-foreground">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
                        </p>
                    </AdminTableCell>
                    <AdminTableCell>
                        <StatusBadge type="status" value={product.is_active ? "active" : "inactive"} />
                    </AdminTableCell>
                    <AdminTableCell align="right">
                      <div className="flex justify-end gap-1">
                        <AdminIconButton onClick={() => openEdit(product)} title={t("edit")} tone="primary">
                          <Pencil className="h-4 w-4" />
                        </AdminIconButton>
                        <AdminIconButton onClick={() => handleDelete(product.id)} title={t("delete")} tone="destructive">
                          <Trash2 className="h-4 w-4" />
                        </AdminIconButton>
                      </div>
                    </AdminTableCell>
                  </AdminTableRow>
                ))}
              </AdminTableBody>
            </AdminTable>
          )}
        </AdminDataCard>
      </div>

      <ProductDialogForm
        form={form}
        onSubmit={onSubmit}
        isSubmitting={submitting}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingProduct={editingProduct}
        t={t}
      />
    </DashboardPageShell>
  );
}
