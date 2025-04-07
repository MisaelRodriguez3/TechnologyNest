import { ApiResponse } from "./api.types";
import { Paginated } from "./common.types";
import { Challenge } from "./challenges.types";
import { Example } from "./examples.types";
import { Post } from "./posts.types";

export interface Search extends Paginated {
    challenges: Challenge[];
    examples: Example[];
    posts: Post[];
}

export type SearchResponse = ApiResponse<Search>