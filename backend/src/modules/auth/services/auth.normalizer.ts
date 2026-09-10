import type {
    LoginInput,
} from "../auth.types.js";

export function normalizeLoginInput(
    input: LoginInput,
): LoginInput {
    return {
        email:
            input.email
                .trim()
                .toLowerCase(),

        password:
            input.password,
    };
}
