import api from "./axios";
import { createChallengeFormData, updateChallengeFormData } from "../schemas/challenge.schemas";
import { 
    GetChallengesResponse,
    CreateChallengeResponse,
    GetOneChallengeResponse,
    UpdateChallengeResponse,
    DeleteChallengeResponse
} from "../types/challenges.types";
import { UUID } from "crypto";

export const getChallengesRequest = async (page: number = 1): Promise<GetChallengesResponse> => await api.get('/challenges', {
    params: { page }
})
export const getChallengesByTopicRequest = async (topic_id: UUID, page: number = 1): Promise<GetChallengesResponse> => await api.get('/challenges', {
    params: { page, topic_id }
})
export const getOneChallengeRequest = async(id: UUID): Promise<GetOneChallengeResponse> => await api.get(`/challenges/${id}`)
export const createChallengeRequest = async (data: createChallengeFormData): Promise<CreateChallengeResponse> => api.post('/challenges', data)
export const updateChallengeRequest = async(data: updateChallengeFormData, id: UUID): Promise<UpdateChallengeResponse> => await api.patch(`/challenges/${id}`, data)
export const deleteChallengeRequest = async(id:UUID): Promise<DeleteChallengeResponse> => await api.delete(`/challenges/${id}`)