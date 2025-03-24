import { z } from "zod";

export const createCommentSchema = z.object({
    comment: z.string()
        .min(1, 'El comentario no puede estar vacío')
        .max(200, 'Máximo 200 caracteres'),
    post_id: z.string(),
});

export const updateCommentSchema = z.object({
    comment: z.string()
        .min(1, 'El comentario no puede estar vacío')
        .max(200, 'Máximo 200 caracteres'),
})

export type CreateCommentFormData = z.infer<typeof createCommentSchema>;
export type UpdateCommentFormData = z.infer<typeof updateCommentSchema>;