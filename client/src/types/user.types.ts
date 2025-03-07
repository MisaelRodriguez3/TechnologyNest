export interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    image_url: string;
    mfa_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface UserUpdate {
    id: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
    image_url?: string;
    mfa_active?: boolean;
}
