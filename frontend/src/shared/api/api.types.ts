export interface ApiSuccess<T> {
    success: true;
    data: T;
}

export interface ApiErrorBody {
    success: false;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
}
