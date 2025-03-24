import api from "./axios";
import { RegisterFormData } from "../schemas/user.schema";
import { ChangePasswordFormData, ForgotPasswordFormData, ResetPasswordFormData } from "../schemas/auth.schemas";
import { 
  LoginResponse, 
  SignUpResponse ,
  ConfirmAccountResponse,
  OtpResponse,
  VerifyOtpResponse,
  ChangePasswordResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse
} from "../types/auth.types";

export const registerRequest = async (data: RegisterFormData): Promise<SignUpResponse> => await api.post("/register", data)
export const loginRequest = async (data: FormData): Promise<LoginResponse> => await api.post("/login", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
export const verifyEmailRequest = async (token: string): Promise<ConfirmAccountResponse> => await api.post(`/confirm-account?token=${token}`)
export const resendConfirmationRequest = async(email: string) => await api.post(`/resend-confirmation?email=${email}`)
export const generateTotpQRResuqest = async (username: string): Promise<OtpResponse> => await api.post("/otp", {username})
export const verifyTOTP = async (data: {username: string, totp_code:string}): Promise<VerifyOtpResponse> => await api.post("/verify-otp", data)
export const changePasswordRequest = async (data: ChangePasswordFormData): Promise<ChangePasswordResponse> => await api.post("/change-password", data)
export const forgotPasswordRequest = async (data: ForgotPasswordFormData): Promise<ForgotPasswordResponse> => await api.post("/forgot-password", data)
export const resetPasswordRequest = async (data: ResetPasswordFormData, token: string): Promise<ResetPasswordResponse> => await api.post(`/reset-password?token=${token}`, data)