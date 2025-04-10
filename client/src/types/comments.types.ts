import { UUID } from "crypto";
import { ApiResponse } from "./api.types";
import { Common, Author } from "./common.types";

export interface Comment extends Common {
    comment: string;
    author: Author
    post_id: UUID
}

export type GetCommentsResponse = ApiResponse<Comment[]>;
export type CreateCommentResponse = ApiResponse<string>;
export type UpdateCommentResponse = ApiResponse<string>;
export type DeleteCommentResponse = ApiResponse<string>;