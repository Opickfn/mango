import { api } from "@/src/lib/http/axios";
import { ProductFormData } from "../schema/productSchema";

export const productService = {
  async getProducts() {
    return api.get("/v1/products");
  },

  async createProduct(data: ProductFormData) {
    return api.post("/v1/products", data);
  },

  async updateProduct(id: number, data: ProductFormData) {
    return api.put(`/v1/products/${id}`, data);
  },

  async deleteProduct(id: number) {
    return api.delete(`/v1/products/${id}`);
  },
};
