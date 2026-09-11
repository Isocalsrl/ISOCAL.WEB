import { forwardRef } from "react";
import type { PublicProduct } from "../../products/types/product.types";
import { Button } from "../../../shared/components/ui/Button";
import { FormField } from "../../../shared/components/ui/FormField";
import { InlineAlert } from "../../../shared/components/feedback/InlineAlert";
import type {
    QuoteRequestCustomerField,
    QuoteRequestFormValues,
} from "../types/quoteRequest.types";

interface QuotationRequestFormProps {
    products: readonly PublicProduct[];
    form: QuoteRequestFormValues;
    isSubmitting: boolean;
    errorMessage: string | null;
    onCustomerChange: (field: QuoteRequestCustomerField, value: string) => void;
    onItemChange: (productId: number, field: "quantity" | "notes", value: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

export const QuotationRequestForm = forwardRef<HTMLFormElement, QuotationRequestFormProps>(function QuotationRequestForm({
    products,
    form,
    isSubmitting,
    errorMessage,
    onCustomerChange,
    onItemChange,
    onSubmit,
    onCancel,
}, ref) {
    return (
        <form ref={ref} className="quotation-request-form" onSubmit={(event) => { event.preventDefault(); void onSubmit(); }}>
            <div className="quotation-request-form-heading">
                <p className="eyebrow">Datos de contacto</p>
                <h2>Completa tu solicitud</h2>
                <p>Usaremos estos datos únicamente para revisar tu requerimiento comercial.</p>
            </div>

            <div className="quotation-request-fields">
                <FormField label="Nombre completo" htmlFor="quote-full-name" required>
                    <input className="form-control" id="quote-full-name" type="text" maxLength={120} value={form.fullName} onChange={(event) => onCustomerChange("fullName", event.target.value)} disabled={isSubmitting} required />
                </FormField>
                <FormField label="Correo electrónico" htmlFor="quote-email" required>
                    <input className="form-control" id="quote-email" type="email" maxLength={254} value={form.email} onChange={(event) => onCustomerChange("email", event.target.value)} disabled={isSubmitting} required />
                </FormField>
                <FormField label="Teléfono o WhatsApp" htmlFor="quote-phone" required>
                    <input className="form-control" id="quote-phone" type="tel" maxLength={30} value={form.phone} onChange={(event) => onCustomerChange("phone", event.target.value)} disabled={isSubmitting} required />
                </FormField>
                <FormField label="Empresa" htmlFor="quote-company">
                    <input className="form-control" id="quote-company" type="text" maxLength={160} value={form.companyName} onChange={(event) => onCustomerChange("companyName", event.target.value)} disabled={isSubmitting} />
                </FormField>
                <FormField label="RUC" htmlFor="quote-ruc">
                    <input className="form-control" id="quote-ruc" type="text" inputMode="numeric" maxLength={20} value={form.ruc} onChange={(event) => onCustomerChange("ruc", event.target.value)} disabled={isSubmitting} />
                </FormField>
                <FormField label="Cargo" htmlFor="quote-job-title">
                    <input className="form-control" id="quote-job-title" type="text" maxLength={120} value={form.jobTitle} onChange={(event) => onCustomerChange("jobTitle", event.target.value)} disabled={isSubmitting} />
                </FormField>
                <FormField label="Ciudad o distrito" htmlFor="quote-location">
                    <input className="form-control" id="quote-location" type="text" maxLength={120} value={form.location} onChange={(event) => onCustomerChange("location", event.target.value)} disabled={isSubmitting} />
                </FormField>
            </div>

            <div className="quotation-request-items">
                <div className="quotation-request-form-heading">
                    <p className="eyebrow">Productos</p>
                    <h2>Detalle del requerimiento</h2>
                </div>
                {products.map((product) => {
                    const item = form.items.find((candidate) => candidate.productId === product.id);
                    if (!item) return null;
                    return (
                        <article className="quotation-request-item" key={product.id}>
                            <h3>{product.name}</h3>
                            <div className="quotation-request-item-fields">
                                <FormField label="Cantidad" htmlFor={`quote-quantity-${product.id}`} required>
                                    <input className="form-control" id={`quote-quantity-${product.id}`} type="number" inputMode="numeric" min={1} max={999} step={1} value={item.quantity} onChange={(event) => onItemChange(product.id, "quantity", event.target.value)} disabled={isSubmitting} required />
                                </FormField>
                                <FormField label="Observación del producto" htmlFor={`quote-item-notes-${product.id}`}>
                                    <textarea className="form-control" id={`quote-item-notes-${product.id}`} maxLength={500} value={item.notes} onChange={(event) => onItemChange(product.id, "notes", event.target.value)} disabled={isSubmitting} />
                                </FormField>
                            </div>
                        </article>
                    );
                })}
            </div>

            <FormField label="Observaciones generales" htmlFor="quote-notes">
                <textarea className="form-control" id="quote-notes" maxLength={1500} value={form.notes} onChange={(event) => onCustomerChange("notes", event.target.value)} disabled={isSubmitting} />
            </FormField>
            {errorMessage && <InlineAlert>{errorMessage}</InlineAlert>}
            <div className="quotation-request-actions">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>Volver a la selección</Button>
                <Button type="submit" variant="primary" isLoading={isSubmitting} loadingLabel="Registrando solicitud...">Registrar solicitud</Button>
            </div>
        </form>
    );
});
