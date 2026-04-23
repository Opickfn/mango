import { web } from "@/src/lib/http/axios";
import { LoginFormData } from "../schema/loginSchema";
import { RegisterFormData } from "../schema/registerSchema";
import { ForgotPasswordFormData, ResetPasswordFormData } from "../schema/passwordSchema";

export const authService = {
  async login(data: LoginFormData) {
    await web.get("/sanctum/csrf-cookie");
    return web.post("/login", data, {
      headers: {
        Accept: "application/json",
      },
    });
  },

  async register(data: RegisterFormData) {
    await web.get("/sanctum/csrf-cookie");
    return web.post("/register", data, {
      headers: {
        Accept: "application/json",
      },
    });
  },

  async forgotPassword(data: ForgotPasswordFormData) {
    await web.get("/sanctum/csrf-cookie");
    return web.post("/forgot-password", data);
  },

  async resetPassword(data: ResetPasswordFormData) {
    await web.get("/sanctum/csrf-cookie");
    return web.post("/reset-password", data);
  },

  async resendVerification() {
    return web.post("/email/verification-notification");
  },
};
