export interface LoginResponse {
    status: number;
    data: LoginSuccess | LoginMFA;
}

interface LoginSuccess {
    access_token: string;
    token_type: string;
}

interface LoginMFA {
    mfa_active: true;
}
