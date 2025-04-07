import { UUID } from "crypto";

export interface Common {
    id: UUID;
    created_at: string;
    updated_at: string;
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

export interface Data {
    topic: { id: UUID };
    title: string;
    description: string;
    code?: string; // Propiedad opcional
    difficulty?: 'Fácil' | 'Medio' | 'Alto' | 'Extremo'
}