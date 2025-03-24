import { z } from "zod";

export const createChallengeSchema = z.object({
    title: z.string()
        .min(5, "El título debe tener al menos 5 caracteres.")
        .max(100, "El título debe tener como máximo 100 caracteres"),
    description: z.string()
        .min(20, "La descripción debe tener al menos 20 caracteres.")
        .max(500, "La descripción debe tener como máximo 500 caracteres"),
    difficulty: z.enum(['Fácil', 'Medio', 'Alto', 'Extremo']),
    topic_id: z.string().uuid("El id es inválido")
})

export const updateChallengeSchema = z.object({
    title: z.string()
        .min(5, "El título debe tener al menos 5 caracteres.")
        .max(100, "El título debe tener como máximo 100 caracteres")
        .optional(),
    description: z.string()
        .min(20, "La descripción debe tener al menos 20 caracteres.")
        .max(500, "La descripción debe tener como máximo 500 caracteres")
        .optional(),
    difficulty: z.enum(['Fácil', 'Medio', 'Alto', 'Extremo'])
        .optional(),
    topic_id: z.string().uuid("El id es inválido")
        .optional()
})

export type createChallengeFormData = z.infer<typeof createChallengeSchema>;
export type updateChallengeFormData = z.infer<typeof updateChallengeSchema>;