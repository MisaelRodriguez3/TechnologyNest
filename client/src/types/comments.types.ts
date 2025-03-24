import { CreateCommentFormData } from "../schemas/comment.schema";

export interface Comment extends CreateCommentFormData {
    id: string;
    created_at: string;
    updated_at: string;
}

export interface CommentFormProps {
    post_id: string;
    user_id: string;
}