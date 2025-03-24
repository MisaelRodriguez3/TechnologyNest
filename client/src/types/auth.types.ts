import { ApiResponse } from "./api.types";

interface LoginSuccess {
    access_token: string;
    token_type: string;
}

interface LoginMFA {
    mfa_active: true;
}

export type LoginResponse = ApiResponse<LoginSuccess | LoginMFA>;
export type SignUpResponse = ApiResponse<string>
export type ConfirmAccountResponse = ApiResponse<string>
export type OtpResponse = ApiResponse<string>
export type VerifyOtpResponse = ApiResponse<LoginSuccess>
export type ChangePasswordResponse = ApiResponse<string>
export type ForgotPasswordResponse = ApiResponse<string>
export type ResetPasswordResponse = ApiResponse<string>