import api from "./axios";
import { CreateCommentFormData, UpdateCommentFormData } from "../schemas/comment.schema";
import { 
    GetCommentsResponse,
    CreateCommentResponse,
    UpdateCommentResponse,
    DeleteCommentResponse
} from "../types/comments.types";
import { UUID } from "crypto";

export const getCommentsByPostRequest = async(post_id: UUID): Promise<GetCommentsResponse> => api.get('/comments', {
    params: {post_id}
})
export const createCommentRequest = async (data: CreateCommentFormData): Promise<CreateCommentResponse> => api.post('/comments', data)
export const updateCommentRequest = async(data: UpdateCommentFormData, id: UUID): Promise<UpdateCommentResponse> => api.patch(`/comments/${id}`, data)
export const deleteCommentRequest = async(id: UUID): Promise<DeleteCommentResponse> => api.delete(`/comments/${id}`)