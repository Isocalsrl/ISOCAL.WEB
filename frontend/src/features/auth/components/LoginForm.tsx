import {
    useState,
    type FormEvent,
} from "react";

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    ApiError,
} from "../../../shared/api/httpClient";

import {
    InlineAlert,
} from "../../../shared/components/feedback/InlineAlert";

import {
    Button,
} from "../../../shared/components/ui/Button";

import {
    FormField,
} from "../../../shared/components/ui/FormField";

import {
    useAuth,
} from "../hooks/useAuth";

import {
    validateLogin,
} from "../validation/login.validation";

interface LoginLocationState {
    from?: string;
}

function getLoginErrorMessage(
    error: unknown,
): string {
    if (
        error instanceof ApiError &&
        error.status === 401
    ) {
        return "Correo o contraseña incorrectos.";
    }

    if (
        error instanceof ApiError &&
        error.code === "NETWORK_ERROR"
    ) {
        return "No pudimos conectar con el servidor. Comprueba que la API esté encendida.";
    }

    if (error instanceof ApiError) {
        return error.message;
    }

    return "Ocurrió un error inesperado. Inténtalo nuevamente.";
}

export function LoginForm() {
    const {
        login,
        status,
    } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] =
        useState(false);
    const [errorMessage, setErrorMessage] =
        useState<string | null>(
            status === "error"
                ? "No se pudo verificar la sesión anterior. Aún puedes intentar ingresar."
                : null,
        );

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();
        setErrorMessage(null);

        const validation = validateLogin(
            email,
            password,
        );

        if (!validation.credentials) {
            setErrorMessage(
                validation.errorMessage ??
                    "Revisa tus credenciales.",
            );
            return;
        }

        setIsSubmitting(true);

        try {
            await login(validation.credentials);

            const state =
                location.state as
                    | LoginLocationState
                    | null;

            navigate(state?.from ?? "/admin", {
                replace: true,
            });
        } catch (error) {
            setErrorMessage(
                getLoginErrorMessage(error),
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            className="login-card"
            onSubmit={handleSubmit}
            noValidate
        >
            <div>
                <p className="eyebrow">
                    Sistema de gestión
                </p>
                <h2>Iniciar sesión</h2>
                <p className="login-intro">
                    Ingresa tus credenciales para
                    continuar al panel.
                </p>
            </div>

            <FormField
                label="Correo electrónico"
                htmlFor="email"
                required
            >
                <input
                    className="form-control"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    placeholder="nombre@isocal.pe"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                    disabled={isSubmitting}
                    autoFocus
                    required
                />
            </FormField>

            <FormField
                label="Contraseña"
                htmlFor="password"
                required
            >
                <input
                    className="form-control"
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                    }}
                    disabled={isSubmitting}
                    minLength={8}
                    maxLength={128}
                    required
                />
            </FormField>

            {errorMessage && (
                <InlineAlert>
                    {errorMessage}
                </InlineAlert>
            )}

            <Button
                className="login-button"
                type="submit"
                variant="dark"
                isLoading={isSubmitting}
                loadingLabel="Ingresando..."
            >
                Ingresar al panel
            </Button>

            <Link
                className="catalog-link"
                to="/"
            >
                Volver al catálogo público
            </Link>
        </form>
    );
}
