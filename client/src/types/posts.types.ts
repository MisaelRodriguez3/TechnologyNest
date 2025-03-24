import { ApiResponse } from "./api.types";
import {Common, Author, TopicInfo, Paginated} from "./common.types";

export interface Post extends Common {
    title: string;
    description: string;
    code?: string;
    author: Author;
    topic: TopicInfo;
}

interface PaginatedResponse extends Paginated {
    posts: Post[]
}

export type GetPostsResponse = ApiResponse<PaginatedResponse>;
export type CreatePostResponse = ApiResponse<string>;
export type GetOnePostResponse = ApiResponse<Post>;
export type UpdatePostResponse = ApiResponse<string>;
export type DeletePostResponse = ApiResponse<string>