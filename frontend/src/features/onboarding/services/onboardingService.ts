import { api } from "@/src/lib/http/axios";
import { CompanyFormData, BusinessProfileFormData } from "../schema/onboardingSchema";

export const onboardingService = {
  async submitCompany(data: CompanyFormData) {
    return api.post("/v1/umkm/onboarding", data);
  },

  async submitBusinessProfile(data: BusinessProfileFormData) {
    return api.post("/v1/umkm/profile", data);
  },

  async getUserOnboardingStatus() {
    return api.get("/v1/me");
  }
};
