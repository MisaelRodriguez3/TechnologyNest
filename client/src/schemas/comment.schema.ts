import { z } from "zod";

export const commentSchema = z.object({
    comment: z.string()
        .min(1, 'El comentario no puede estar vacío')
        .max(200, 'Máximo 200 caracteres'),
    post_id: z.string(),
    user_id: z.string()
});

export type CommentFormData = z.infer<typeof commentSchema>