import api from "./axios";
import { RegisterFormData } from "../schemas/user.schema";
import { LoginResponse } from "../types/auth.types";

export const registerRequest = async (data: RegisterFormData) => await api.post("/register", data)
export const loginRequest = async (data: FormData): Promise<LoginResponse> => await api.post("/login", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
export const verifyEmailRequest = async (token: string) => await api.post(`/confirm-account?token=${token}`)
export const generateTotpQRResuqest = async (username: string) => await api.post("/otp", {username})
export const verifyTOTP = async (data: {username: string, totp_code:string}) => await api.post("/verify-otp", data)