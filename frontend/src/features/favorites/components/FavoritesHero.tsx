import { Link } from "react-router-dom";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";

export function FavoritesHero() {
    return (
        <section className="ix-utility-hero">
            <div className="public-container ix-utility-hero-grid">
                <div>
                    <p className="ix-breadcrumb">
                        <Link to="/">Inicio</Link> <span>/</span> Favoritos
                    </p>
                    <p className="ix-kicker">Favoritos</p>
                    <h1>Equipos guardados.</h1>
                    <p>Revisa los productos guardados y añade a cotización los que necesites.</p>
                </div>
                <Link className="ix-inline-link" to="/productos">
                    Volver al catálogo <CorporateIcon name="arrow" />
                </Link>
            </div>
        </section>
    );
}
