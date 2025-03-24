import { ApiResponse } from "./api.types";
import { Common } from "./common.types";

export interface Topic extends Common {
    name: string;
    image_url: string;
}

export type GetTopicsResponse = ApiResponse<Topic[] | []>