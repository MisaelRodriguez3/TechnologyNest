import api from "./axios";
import { createPostFormData, updatePostFormData } from "../schemas/post.schemas";
import { 
    GetPostsResponse,
    CreatePostResponse,
    GetOnePostResponse,
    UpdatePostResponse,
    DeletePostResponse
} from "../types/posts.types";

export const getPostsRequest = async (page: number = 1): Promise<GetPostsResponse> => await api.get(`/posts?page=${page}`)
export const getPostsByTopicRequest = async ({page, topic_id}: {page: number, topic_id:string}): Promise<GetPostsResponse> => await api.get(`/posts?page=${page}&topic_id=${topic_id}`)
export const getOnePostRequest = async(id: string): Promise<GetOnePostResponse> => await api.get(`/posts/${id}`)
export const createPostRequest = async (data: createPostFormData): Promise<CreatePostResponse> => api.post('/posts', data)
export const updatePostRequest = async(data: updatePostFormData, id: string): Promise<UpdatePostResponse> => await api.patch(`/posts/${id}`, data)
export const deletePostRequest = async(id:string): Promise<DeletePostResponse> => await api.delete(`/posts/${id}`)