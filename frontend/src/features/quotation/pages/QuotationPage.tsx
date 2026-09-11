import {
    PageSeo,
} from "../../../shared/seo/PageSeo";
import {
    QuotationHero,
} from "../components/QuotationHero";
import {
    QuotationSelection,
} from "../components/QuotationSelection";
import {
    useQuotationProducts,
} from "../hooks/useQuotationProducts";
import {
    useQuoteRequest,
} from "../hooks/useQuoteRequest";

export function QuotationPage() {
    const selection = useQuotationProducts();
    const quoteRequest = useQuoteRequest({
        products: selection.quotationProducts,
        onSuccess: selection.clearQuotation,
    });

    return (
        <main className="public-main quotation-page">
            <PageSeo
                title="Cotización | ISOCAL"
                description="Selecciona productos del catálogo de ISOCAL y registra una solicitud de cotización sin necesidad de crear una cuenta."
                canonicalPath="/cotizacion"
            />

            <QuotationHero />
            <QuotationSelection
                selection={selection}
                quoteRequest={quoteRequest}
            />
        </main>
    );
}
