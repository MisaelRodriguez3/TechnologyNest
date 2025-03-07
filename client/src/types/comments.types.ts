import { CommentFormData } from "../schemas/comment.schema";
import { FormGeneralProps } from "./form.types";

export interface Comment extends CommentFormData {
    id: string;
    created_at: string;
    updated_at: string;
}

export interface CommentFormProps extends FormGeneralProps<CommentFormData> {
    post_id: string;
    user_id: string;
}