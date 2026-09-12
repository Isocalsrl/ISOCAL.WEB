import { Link } from "react-router-dom";

import {
    SectionState,
} from "../../../shared/components/ui/SectionState";
import type {
    QuotationProductsState,
} from "../hooks/useQuotationProducts";
import {
    useQuotationRequestFocus,
} from "../hooks/useQuotationRequestFocus";
import type {
    QuoteRequestState,
} from "../hooks/useQuoteRequest";
import {
    QuotationProductItem,
} from "./QuotationProductItem";
import {
    QuotationRequestForm,
} from "./QuotationRequestForm";
import {
    QuotationRequestSuccess,
} from "./QuotationRequestSuccess";
import {
    QuotationSummary,
} from "./QuotationSummary";

interface QuotationSelectionProps {
    selection: QuotationProductsState;
    quoteRequest: QuoteRequestState;
}

export function QuotationSelection({
    selection,
    quoteRequest,
}: QuotationSelectionProps) {
    const requestFormRef = useQuotationRequestFocus(quoteRequest.isOpen);

    return (
        <section
            className="quotation-section"
            aria-labelledby="quotation-title"
        >
            <div className="public-container">
                <div className="quotation-heading">
                    <div>
                        <p className="eyebrow">Cotización</p>
                        <h2 id="quotation-title">
                            Productos seleccionados
                        </h2>
                    </div>

                    {!quoteRequest.receipt && (
                        <p className="quotation-count" aria-live="polite">
                            <strong>{selection.quotationCount}</strong>{" "}
                            {selection.quotationCount === 1
                                ? "producto seleccionado"
                                : "productos seleccionados"}
                        </p>
                    )}
                </div>

                {quoteRequest.receipt ? (
                    <QuotationRequestSuccess receipt={quoteRequest.receipt} />
                ) : selection.quotationCount === 0 ? (
                    <div className="quotation-empty">
                        <h3>Tu lista de cotización está vacía.</h3>
                        <p>
                            Explora el catálogo y agrega los productos sobre los
                            que deseas solicitar información comercial.
                        </p>
                        <Link
                            className="ui-button ui-button-primary"
                            to="/productos"
                        >
                            Explorar catálogo
                        </Link>
                    </div>
                ) : selection.isLoading ? (
                    <div className="quotation-state">
                        <SectionState
                            title="Cargando cotización"
                            description="Estamos consultando la información actual de los productos seleccionados."
                            isLoading
                        />
                    </div>
                ) : selection.errorMessage ? (
                    <div className="quotation-state">
                        <SectionState
                            title="No pudimos cargar la cotización"
                            description={selection.errorMessage}
                            actionLabel="Intentar nuevamente"
                            onAction={selection.reload}
                        />
                    </div>
                ) : selection.quotationProducts.length === 0 ? (
                    <div className="quotation-state">
                        <SectionState
                            title="Actualizando cotización"
                            description="Estamos verificando la disponibilidad de los productos seleccionados."
                            isLoading
                        />
                    </div>
                ) : (
                    <>
                        <div className="quotation-layout">
                            <div
                                className="quotation-products-list"
                                aria-label="Productos seleccionados para cotización"
                            >
                                {selection.quotationProducts.map((product) => (
                                    <QuotationProductItem
                                        key={product.id}
                                        product={product}
                                        categoryName={
                                            product.categoryId === null
                                                ? "Sin categoría"
                                                : selection.categoryNamesById.get(
                                                      product.categoryId,
                                                  ) ?? "Categoría"
                                        }
                                    />
                                ))}
                            </div>

                            <QuotationSummary
                                productCount={selection.quotationProducts.length}
                                isRequestOpen={quoteRequest.isOpen}
                                onRequest={quoteRequest.openRequest}
                                onClear={selection.clearQuotation}
                            />
                        </div>

                        {quoteRequest.isOpen && (
                            <QuotationRequestForm
                                ref={requestFormRef}
                                products={selection.quotationProducts}
                                form={quoteRequest.form}
                                isSubmitting={quoteRequest.isSubmitting}
                                errorMessage={quoteRequest.errorMessage}
                                onCustomerChange={quoteRequest.updateCustomerField}
                                onItemChange={quoteRequest.updateItem}
                                onSubmit={quoteRequest.submitRequest}
                                onCancel={quoteRequest.closeRequest}
                            />
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
