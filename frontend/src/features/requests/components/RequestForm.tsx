import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { InlineAlert } from "../../../shared/components/feedback/InlineAlert";
import { CustomerFields } from "./CustomerFields";
import { RequestReceipt } from "./RequestReceipt";
import { useRequestSubmission } from "../hooks/useRequestSubmission";
import { readRequestCustomer, type RequestKind, type RequestSubmission } from "../model/request.types";

interface Props {
    kind?: RequestKind;
    subject?: string;
    children?: ReactNode;
    readDetails?: (data: FormData) => Pick<RequestSubmission, "items" | "complaint">;
    onSuccess?: () => void;
    disabled?: boolean;
}

function getSubmitLabel(kind: RequestKind) {
    if (kind === "complaint") return "Enviar reclamación";
    if (kind === "quotation") return "Enviar solicitud";
    return "Enviar consulta";
}


export function RequestForm({
    kind = "contact",
    subject = "",
    children,
    readDetails,
    onSuccess,
    disabled = false,
}: Props) {
    const submission = useRequestSubmission(onSuccess);

    if (submission.receipt) {
        return <RequestReceipt receipt={submission.receipt} kind={kind} />;
    }

    const submitLabel = getSubmitLabel(kind);

    return (
        <form
            className="co-request-form"
            aria-busy={submission.busy}
            onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                void submission.submit({
                    kind,
                    consent: data.get("consent") === "on",
                    customer: readRequestCustomer(data),
                    items: [],
                    ...readDetails?.(data),
                });
            }}
        >
            <h2>{kind === "complaint" ? "Hoja de reclamación" : "Cuéntanos qué necesitas."}</h2>
            <p>
                {kind === "quotation"
                    ? "Al enviar, recibirás automáticamente por correo la cotización en PDF, con los precios sin completar."
                    : kind === "complaint"
                      ? "Completa tus datos y el detalle. Al enviar podrás descargar una copia de tu hoja."
                      : "Déjanos tus datos y describe lo que necesitas. Te responderemos por correo."}
            </p>

            <fieldset disabled={submission.busy || disabled}>
                <CustomerFields />
                {children}

                <label>
                    {kind === "complaint" ? "Detalle del reclamo o queja *" : "Tu requerimiento *"}
                    <textarea
                        name="notes"
                        required
                        maxLength={1500}
                        rows={5}
                        defaultValue={subject}
                        placeholder="Indica el equipo, servicio o necesidad. Añade modelo, rango o contexto si lo conoces."
                    />
                </label>

                <label className="co-consent">
                    <input type="checkbox" name="consent" required />
                    <span>
                        He leído la <Link to="/privacidad" target="_blank">política de privacidad</Link> y autorizo el uso de mis datos para atender esta solicitud.
                    </span>
                </label>

                {submission.error ? (
                    <div className="co-form-error-wrap">
                        <InlineAlert variant="error">
                            <strong>No pudimos enviar la solicitud.</strong>
                            <span>{submission.error}</span>
                        </InlineAlert>
                    </div>
                ) : null}

                <button
                    className="co-button co-submit"
                    type="submit"
                    aria-busy={submission.busy}
                >
                    <span>{submission.busy ? "Enviando solicitud…" : submitLabel}</span>
                    {submission.busy ? (
                        <span className="co-submit-spinner" aria-hidden="true" />
                    ) : (
                        <span aria-hidden="true">→</span>
                    )}
                </button>

                <p className="co-form-note">
                    {kind === "complaint"
                        ? "Presentar un reclamo no impide acudir a otras vías de solución ni es requisito previo para denunciar ante Indecopi."
                        : "Sin crear una cuenta. Te respondemos directamente por correo."}
                </p>
            </fieldset>
        </form>
    );
}
