import api from "./axios";
import { GetTopicsResponse } from "../types/topic.types";

export const getTopicsRequest = async(): Promise<GetTopicsResponse> => await api.get("/topics")