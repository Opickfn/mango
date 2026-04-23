import { api } from "@/src/lib/http/axios";
import { ProfileFormData, PasswordFormData } from "../schema/profileSchema";

export const profileService = {
  async updateProfile(data: ProfileFormData) {
    return api.put("/v1/profile", data);
  },

  async updatePassword(data: PasswordFormData) {
    return api.put("/v1/profile/password", data);
  },
};
