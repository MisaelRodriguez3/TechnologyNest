import api from "./axios";
import { createExampleFormData, updateExampleFormData } from "../schemas/example.schemas";
import { 
    GetExamplesResponse,
    CreateExampleResponse,
    GetOneExampleResponse,
    UpdateExampleResponse,
    DeleteExampleResponse
} from "../types/examples.types";

export const getExamplesRequest = async (page: number = 1): Promise<GetExamplesResponse> => await api.get(`/examples?page=${page}`)
export const getExamplesByTopicRequest = async ({page, topic_id}: {page: number, topic_id:string}): Promise<GetExamplesResponse> => await api.get(`/examples?page=${page}&topic_id=${topic_id}`)
export const getOneExampleRequest = async(id: string): Promise<GetOneExampleResponse> => await api.get(`/examples/${id}`)
export const createExampleRequest = async (data: createExampleFormData): Promise<CreateExampleResponse> => api.post('/examples', data)
export const updateExampleRequest = async(data: updateExampleFormData, id: string): Promise<UpdateExampleResponse> => await api.patch(`/examples/${id}`, data)
export const deleteExampleRequest = async(id:string): Promise<DeleteExampleResponse> => await api.delete(`/examples/${id}`)