import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { productService } from "../services/productService";
import { productSchema, ProductFormData } from "../schema/productSchema";

export const useUmkmProducts = () => {
  const t = useTranslations("ProductsPage");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [status, setStatus] = useState<{ type: "success" | "destructive"; message: string } | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      unit: "pcs",
      price: 0,
      is_active: true,
    },
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts();
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onSubmit = async (data: ProductFormData) => {
    setSubmitting(true);
    setStatus(null);
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, data);
        setStatus({ type: "success", message: "Product updated successfully" });
      } else {
        await productService.createProduct(data);
        setStatus({ type: "success", message: "Product created successfully" });
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error: any) {
      setStatus({ type: "destructive", message: error.response?.data?.message || "Failed to save product" });
      console.error("Failed to save product", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setStatus(null);
    try {
      await productService.deleteProduct(id);
      setStatus({ type: "success", message: "Product deleted successfully" });
      fetchProducts();
    } catch (err: any) {
      setStatus({ type: "destructive", message: "Failed to delete product" });
      console.error("Failed to delete product", err);
    }
  };

  const openCreate = () => {
    setEditingProduct(null);
    form.reset({
      name: "",
      sku: "",
      unit: "pcs",
      price: 0,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      sku: product.sku,
      unit: product.unit,
      price: product.price,
      is_active: !!product.is_active,
    });
    setIsModalOpen(true);
  };

  return {
    products,
    loading,
    submitting,
    isModalOpen,
    setIsModalOpen,
    editingProduct,
    form,
    onSubmit: form.handleSubmit(onSubmit),
    handleDelete,
    openCreate,
    openEdit,
    refresh: fetchProducts,
    status,
    setStatus,
    t,
  };
};
