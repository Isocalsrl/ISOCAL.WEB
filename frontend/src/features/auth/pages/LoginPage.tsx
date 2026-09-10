import {
    BrandMark,
} from "../../../shared/components/brand/BrandMark";

import {
    LoginForm,
} from "../components/LoginForm";

import "../styles/login.css";

export function LoginPage() {
    return (
        <main className="login-page">
            <section
                className="login-brand"
                aria-label="Presentación de ISOCAL"
            >
                <BrandMark />

                <div className="brand-copy">
                    <p className="eyebrow">
                        Acceso interno
                    </p>
                    <h1>
                        Administración ISOCAL
                    </h1>
                    <p>
                        Gestión de catálogo y contenidos
                        para el equipo autorizado.
                    </p>
                </div>

                <p className="brand-caption">
                    Precisión · Confianza · Experiencia
                </p>
            </section>

            <section className="login-panel">
                <LoginForm />
            </section>
        </main>
    );
}
