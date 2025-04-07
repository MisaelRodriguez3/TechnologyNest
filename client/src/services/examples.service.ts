import api from "./axios";
import { createExampleFormData, updateExampleFormData } from "../schemas/example.schemas";
import { 
    GetExamplesResponse,
    CreateExampleResponse,
    GetOneExampleResponse,
    UpdateExampleResponse,
    DeleteExampleResponse
} from "../types/examples.types";
import { UUID } from "crypto";

export const getExamplesRequest = async (page: number = 1): Promise<GetExamplesResponse> => await api.get('/examples', {
    params: { page }
})
export const getExamplesByTopicRequest = async (topic_id: UUID, page: number = 1): Promise<GetExamplesResponse> => await api.get('/examples', {
    params: { page, topic_id }
})
export const getOneExampleRequest = async(id: string): Promise<GetOneExampleResponse> => await api.get(`/examples/${id}`)
export const createExampleRequest = async (data: createExampleFormData): Promise<CreateExampleResponse> => api.post('/examples', data)
export const updateExampleRequest = async(data: updateExampleFormData, id: string): Promise<UpdateExampleResponse> => await api.patch(`/examples/${id}`, data)
export const deleteExampleRequest = async(id:string): Promise<DeleteExampleResponse> => await api.delete(`/examples/${id}`)