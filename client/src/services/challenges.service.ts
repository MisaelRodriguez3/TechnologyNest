import api from "./axios";
import { createChallengeFormData, updateChallengeFormData } from "../schemas/challenge.schemas";
import { 
    GetChallengesResponse,
    CreateChallengeResponse,
    GetOneChallengeResponse,
    UpdateChallengeResponse,
    DeleteChallengeResponse
} from "../types/challenges.types";

export const getChallengesRequest = async (page: number = 1): Promise<GetChallengesResponse> => await api.get(`/challenges?page=${page}`)
export const getChallengesByTopicRequest = async ({page, topic_id}: {page: number, topic_id:string}): Promise<GetChallengesResponse> => await api.get(`/challenges?page=${page}&topic_id=${topic_id}`)
export const getOneChallengeRequest = async(id: string): Promise<GetOneChallengeResponse> => await api.get(`/challenges/${id}`)
export const createChallengeRequest = async (data: createChallengeFormData): Promise<CreateChallengeResponse> => api.post('/challenges', data)
export const updateChallengeRequest = async(data: updateChallengeFormData, id: string): Promise<UpdateChallengeResponse> => await api.patch(`/challenges/${id}`, data)
export const deleteChallengeRequest = async(id:string): Promise<DeleteChallengeResponse> => await api.delete(`/challenges/${id}`)