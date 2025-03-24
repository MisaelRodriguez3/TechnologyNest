import { ApiResponse } from "./api.types";
import {Common, Author, TopicInfo, Paginated} from "./common.types";

export interface Challenge extends Common {
    title: string;
    description: string;
    difficulty: 'Fácil' | 'Medio' | 'Alto' | 'Extremo'
    author: Author;
    topic: TopicInfo;
}

interface PaginatedResponse extends Paginated {
    challenges: Challenge[]
}

export type GetChallengesResponse = ApiResponse<PaginatedResponse>;
export type CreateChallengeResponse = ApiResponse<string>;
export type GetOneChallengeResponse = ApiResponse<Challenge>;
export type UpdateChallengeResponse = ApiResponse<string>;
export type DeleteChallengeResponse = ApiResponse<string>