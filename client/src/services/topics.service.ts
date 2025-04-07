import api from "./axios";
import { UUID } from "crypto";
import { GetTopicsResponse } from "../types/topic.types";

export const getTopicsRequest = async(): Promise<GetTopicsResponse> => await api.get("/topics")
export const getContentByTopicRequest = async(topic_id: UUID, page: number = 1) => api.get(`/topics/${topic_id}`, {
    params: {
        page: page
    }
})