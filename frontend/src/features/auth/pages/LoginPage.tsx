import { BrandMark } from "../../../shared/components/brand/BrandMark";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";
import { LoginForm } from "../components/LoginForm";
import "../styles/login.css";

export function LoginPage() {
    return (
        <main className="login-page">
            <section className="login-brand" aria-label="Presentación de ISOCAL">
                <div className="login-brand-top">
                    <BrandMark />
                    <span>Acceso interno</span>
                </div>

                <div className="brand-copy">
                    <p className="eyebrow">Panel administrativo</p>
                    <h1>Gestiona la web de ISOCAL desde un solo lugar.</h1>
                    <p>Actualiza el catálogo, publica artículos y administra accesos con una interfaz diseñada para el trabajo diario.</p>

                    <div className="login-feature-list">
                        <span><CorporateIcon name="package" /> Productos y categorías</span>
                        <span><CorporateIcon name="book" /> Blog y contenidos</span>
                        <span><CorporateIcon name="shield" /> Accesos protegidos por rol</span>
                    </div>
                </div>

                <p className="brand-caption">Sistema interno · ISOCAL</p>
            </section>

            <section className="login-panel">
                <div className="login-panel-inner">
                    <span className="login-panel-kicker">Bienvenido</span>
                    <LoginForm />
                </div>
            </section>
        </main>
    );
}
