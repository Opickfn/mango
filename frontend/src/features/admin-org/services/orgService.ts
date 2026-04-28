import { api } from "@/src/lib/http/axios";
import { OrganizationFormData, DepartmentFormData } from "../schema/orgSchema";

export const orgService = {
  // Institutions
  async getInstitutions(params: any) {
    return api.get("/v1/admin/institutions", { params });
  },
  async createInstitution(data: OrganizationFormData) {
    return api.post("/v1/admin/institutions", data);
  },
  async updateInstitution(id: number, data: OrganizationFormData) {
    return api.put(`/v1/admin/institutions/${id}`, data);
  },
  async deleteInstitution(id: number) {
    return api.delete(`/v1/admin/institutions/${id}`);
  },

  // Departments
  async getDepartments(params: any) {
    return api.get("/v1/admin/departments", { params });
  },
  async createDepartment(data: DepartmentFormData) {
    return api.post("/v1/admin/departments", data);
  },
  async updateDepartment(id: number, data: DepartmentFormData) {
    return api.put(`/v1/admin/departments/${id}`, data);
  },
  async deleteDepartment(id: number) {
    return api.delete(`/v1/admin/departments/${id}`);
  },

  // Context
  async getMyInstitutions() {
    return api.get("/v1/my/institutions");
  },
  async getMyOrganizations() {
    return api.get("/v1/my/organizations");
  },
  async updateOrganization(id: number, data: any) {
    return api.put(`/v1/my/organizations/${id}`, data);
  }
};
