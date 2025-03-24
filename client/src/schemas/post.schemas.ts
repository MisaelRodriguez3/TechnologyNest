import { z } from "zod";

export const createPostSchema = z.object({
    title: z.string()
        .min(5, "El título debe tener al menos 5 caracteres.")
        .max(100, "El título debe tener como máximo 100 caracteres"),
    description: z.string()
        .min(20, "La descripción debe tener al menos 20 caracteres.")
        .max(500, "La descripción debe tener como máximo 500 caracteres"),
    code: z.string()
        .max(5000, 'Solo puedes ingresar 5000 caracteres')
        .optional(),
    topic_id: z.string().uuid("El id es inválido")
})

export const updatePostSchema = z.object({
    title: z.string()
        .min(5, "El título debe tener al menos 5 caracteres.")
        .max(100, "El título debe tener como máximo 100 caracteres")
        .optional(),
    description: z.string()
        .min(20, "La descripción debe tener al menos 20 caracteres.")
        .max(500, "La descripción debe tener como máximo 500 caracteres")
        .optional(),
    code: z.string()
        .max(5000, 'Solo puedes ingresar 5000 caracteres')
        .optional(),
    topic_id: z.string().uuid("El id es inválido")
        .optional()
})

export type createPostFormData = z.infer<typeof createPostSchema>;
export type updatePostFormData = z.infer<typeof updatePostSchema>;