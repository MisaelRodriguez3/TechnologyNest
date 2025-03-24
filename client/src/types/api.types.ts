export interface ApiResponse<T> {
    status: number;
    data: T;
}

export interface ApiError {
    status: number;
    message: string
}