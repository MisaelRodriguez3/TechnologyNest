import { ApiResponse } from "./api.types";
import { Paginated } from "./common.types";
import { Challenge } from "./challenges.types";
import { Example } from "./examples.types";
import { Post } from "./posts.types";

interface Search extends Paginated {
    challenges: Challenge[] | [];
    examples: Example[] | [];
    posts: Post[] | [];
}

type SearchResponse = ApiResponse<Search>

export default SearchResponse