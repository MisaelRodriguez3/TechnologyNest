export interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    image_url: string;
    mfa_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface GetUser {
    status: number;
    data: UserProfile;
}


export interface UserUpdate {
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
    image_url?: string;
    mfa_active?: boolean;
}

export interface UserUpdateResponse {
    status: number;
    data: UserProfile
}