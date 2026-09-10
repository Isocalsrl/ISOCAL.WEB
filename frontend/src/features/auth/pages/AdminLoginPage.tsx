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
    useAuth,
} from "../hooks/useAuth";

import "../styles/auth.css";

const EMAIL_PATTERN =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginLocationState {
    from?: string;
}

export function AdminLoginPage() {
    const {
        login,
        status,
    } = useAuth();

    const navigate =
        useNavigate();

    const location =
        useLocation();

    const [
        email,
        setEmail,
    ] = useState("");

    const [
        password,
        setPassword,
    ] = useState("");

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(
        status === "error"
            ? "No se pudo verificar la sesión anterior. Aún puedes intentar ingresar."
            : null,
    );

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    async function handleSubmit(
        event:
            FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();

        setErrorMessage(null);

        const normalizedEmail =
            email.trim();

        if (
            !normalizedEmail ||
            !password
        ) {
            setErrorMessage(
                "Completa el correo y la contraseña.",
            );

            return;
        }

        if (
            !EMAIL_PATTERN.test(
                normalizedEmail,
            )
        ) {
            setErrorMessage(
                "Ingresa un correo electrónico válido.",
            );

            return;
        }

        if (
            password.length < 8 ||
            password.length > 128
        ) {
            setErrorMessage(
                "La contraseña debe tener entre 8 y 128 caracteres.",
            );

            return;
        }

        setIsSubmitting(true);

        try {
            await login({
                email:
                    normalizedEmail,
                password,
            });

            const state =
                location.state as (
                    LoginLocationState |
                    null
                );

            navigate(
                state?.from ??
                    "/admin",
                {
                    replace: true,
                },
            );
        } catch (error) {
            if (
                error instanceof ApiError &&
                error.status === 401
            ) {
                setErrorMessage(
                    "Correo o contraseña incorrectos.",
                );
            } else if (
                error instanceof ApiError &&
                error.code ===
                    "NETWORK_ERROR"
            ) {
                setErrorMessage(
                    "No pudimos conectar con el servidor. Comprueba que la API esté encendida.",
                );
            } else if (
                error instanceof ApiError
            ) {
                setErrorMessage(
                    error.message,
                );
            } else {
                setErrorMessage(
                    "Ocurrió un error inesperado. Inténtalo nuevamente.",
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="login-page">
            <section
                className="login-brand"
                aria-label="Presentación de ISOCAL"
            >
                <Link
                    className="brand-mark"
                    to="/"
                    aria-label="Ir al catálogo de ISOCAL"
                >
                    <span className="brand-symbol">
                        I
                    </span>

                    <span>ISOCAL</span>
                </Link>

                <div className="brand-copy">
                    <p className="eyebrow">
                        Gestión técnica
                        centralizada
                    </p>

                    <h1>
                        Control claro para
                        un servicio preciso.
                    </h1>

                    <p>
                        Administra el catálogo
                        y la información
                        operativa desde un
                        entorno reservado para
                        el equipo de ISOCAL.
                    </p>
                </div>

                <p className="brand-caption">
                    Metrología · Calibración
                    · Confianza
                </p>
            </section>

            <section
                className="login-panel"
            >
                <form
                    className="login-card"
                    onSubmit={
                        handleSubmit
                    }
                    noValidate
                >
                    <div>
                        <p className="eyebrow">
                            Panel
                            administrativo
                        </p>

                        <h2>Bienvenido</h2>

                        <p className="login-intro">
                            Ingresa con las
                            credenciales
                            asignadas a tu
                            cuenta.
                        </p>
                    </div>

                    <div className="form-field">
                        <label htmlFor="email">
                            Correo electrónico
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="username"
                            placeholder="nombre@isocal.pe"
                            value={email}
                            onChange={(
                                event,
                            ) => {
                                setEmail(
                                    event
                                        .target
                                        .value,
                                );
                            }}
                            disabled={
                                isSubmitting
                            }
                            autoFocus
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="password">
                            Contraseña
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="Mínimo 8 caracteres"
                            value={password}
                            onChange={(
                                event,
                            ) => {
                                setPassword(
                                    event
                                        .target
                                        .value,
                                );
                            }}
                            disabled={
                                isSubmitting
                            }
                            minLength={8}
                            maxLength={128}
                            required
                        />
                    </div>

                    {errorMessage && (
                        <InlineAlert>
                            {errorMessage}
                        </InlineAlert>
                    )}

                    <button
                        className="login-button"
                        type="submit"
                        disabled={
                            isSubmitting
                        }
                    >
                        {isSubmitting ? (
                            <>
                                <span
                                    className="button-spinner"
                                    aria-hidden="true"
                                />

                                Ingresando...
                            </>
                        ) : (
                            "Ingresar al panel"
                        )}
                    </button>

                    <Link
                        className="catalog-link"
                        to="/"
                    >
                        Volver al catálogo
                        público
                    </Link>
                </form>
            </section>
        </main>
    );
}
