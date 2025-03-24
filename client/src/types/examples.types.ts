import { ApiResponse } from "./api.types";
import {Common, Author, TopicInfo, Paginated} from "./common.types";

export interface Example extends Common {
    title: string;
    description: string;
    code?: string;
    author: Author;
    topic: TopicInfo;
}

interface PaginatedResponse extends Paginated {
    examples: Example[]
}

export type GetExamplesResponse = ApiResponse<PaginatedResponse>;
export type CreateExampleResponse = ApiResponse<string>;
export type GetOneExampleResponse = ApiResponse<Example>;
export type UpdateExampleResponse = ApiResponse<string>;
export type DeleteExampleResponse = ApiResponse<string>