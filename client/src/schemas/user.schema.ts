import { z } from "zod";

export const registerSchema = z.object({
  first_name: z.string().min(5, 'El nombre debe tener al menos 5 cracteres'),
  last_name: z.string().min(5, 'El apellido debe tener al menos 5 cracteres'),
  username: z.string().min(6, 'El nick debe tener al menos 6 cracteres'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(50, 'La contraseña solo puede tener 50 caracteres o menos')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/\d/, 'Debe contener al menos un número'),
  confirm_password: z.string(),
  recaptcha: z.string().min(1, 'Debes verificar que no eres un robot')
}).refine((data) => data.password === data.confirm_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_password"],
});
  

export const loginSchema = z.object({
  username: z.string().min(6, 'El nick es requerido'),
  password: z.string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(50, 'La contraseña solo puede tener 50 caracteres o menos')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/\d/, 'Debe contener al menos un número'),
  recaptcha: z.string().min(1, 'Debes verificar que no eres un robot')
});


export const updateUserSchema = z.object({
  first_name: z.string().min(5, 'El nombre debe tener al menos 5 cracteres').optional(),
  last_name: z.string().min(5, 'El apellido debe tener al menos 5 cracteres').optional(),
  username: z.string().min(6, 'El nick debe tener al menos 6 cracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  image_url: z.string().url("La imagen debe ser un enlace válido").optional(),
  mfa_active: z.boolean().optional()
});

export const changePwdSchema = z.object({
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
    .regex(/\d/, 'Debe contener al menos un número')
}).refine((data) => data.password === data.confirm_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_password"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type ChangePwdFormData = z.infer<typeof changePwdSchema>;