import { env } from "../../config/env";
import type { ApiErrorBody, ApiSuccess } from "./api.types";

export class ApiError extends Error {
    readonly status: number;
    readonly code: string;
    readonly details?: unknown;

    constructor(
        status: number,
        code: string,
        message: string,
        details?: unknown,
    ) {
        super(message);

        this.name = "ApiError";
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

function isApiErrorBody(
    value: unknown,
): value is ApiErrorBody {
    if (
        typeof value !== "object" ||
        value === null
    ) {
        return false;
    }

    const candidate =
        value as Partial<ApiErrorBody>;

    return (
        candidate.success === false &&
        typeof candidate.error?.code ===
            "string" &&
        typeof candidate.error.message ===
            "string"
    );
}

function isApiSuccess<T>(
    value: unknown,
): value is ApiSuccess<T> {
    return (
        typeof value === "object" &&
        value !== null &&
        (
            value as Partial<ApiSuccess<T>>
        ).success === true &&
        "data" in value
    );
}

export async function request<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    let response: Response;
    const isFormData = options.body instanceof FormData;

    try {
        response = await fetch(
            `${env.apiURL}${path}`,
            {
                ...options,

                credentials: "include",

                headers: {
                    ...(options.body && !isFormData
                        ? {
                              "Content-Type":
                                  "application/json",
                          }
                        : {}),

                    ...options.headers,
                },
            },
        );
    } catch {
        throw new ApiError(
            0,
            "NETWORK_ERROR",
            "No se pudo conectar con el servidor.",
        );
    }

    const payload: unknown =
        await response
            .json()
            .catch(() => null);

    if (!response.ok) {
        if (isApiErrorBody(payload)) {
            throw new ApiError(
                response.status,
                payload.error.code,
                payload.error.message,
                payload.error.details,
            );
        }

        throw new ApiError(
            response.status,
            "UNEXPECTED_API_ERROR",
            "El servidor devolvió una respuesta inesperada.",
        );
    }

    if (!isApiSuccess<T>(payload)) {
        throw new ApiError(
            response.status,
            "INVALID_API_RESPONSE",
            "La respuesta del servidor no tiene el formato esperado.",
        );
    }

    return payload.data;
}
