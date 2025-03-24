import { UUID } from "crypto";

export interface Common {
    id: UUID;
    created_at: Date;
    updated_at: Date;
}

export interface Author {
    id: UUID;
    username: string;
}

export interface TopicInfo {
    id: UUID;
    name: string;
}

export interface Paginated {
    page: number;
    total_pages: number;
}