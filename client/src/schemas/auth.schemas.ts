import { z } from "zod"

export const changePasswordSchema = z.object({
    previus_password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(50, 'La contraseña solo puede tener 50 caracteres o menos')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/\d/, 'Debe contener al menos un número'),
    password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(50, 'La contraseña solo puede tener 50 caracteres o menos')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/\d/, 'Debe contener al menos un número'),
    confirm_password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(50, 'La contraseña solo puede tener 50 caracteres o menos')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/\d/, 'Debe contener al menos un número'),
}).refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
});

export const forgotPasswordSchema = z.object({
    username: z.string().min(6, 'El nick debe tener al menos 6 cracteres'),
    email: z.string().email('Email inválido'),
})

export const resetPasswordSchema = z.object({
    password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(50, 'La contraseña solo puede tener 50 caracteres o menos')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/\d/, 'Debe contener al menos un número'),
    confirm_password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(50, 'La contraseña solo puede tener 50 caracteres o menos')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/\d/, 'Debe contener al menos un número'),
}).refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
});

export const verifyOTPSchema = z.object({
    username: z.string({
        required_error: "El username es requerido"
    }), 
    totp_code: z.string({
        required_error: "El totp_code es requerido"
    })
})

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type VerifyOTPFormData = z.infer<typeof verifyOTPSchema>;