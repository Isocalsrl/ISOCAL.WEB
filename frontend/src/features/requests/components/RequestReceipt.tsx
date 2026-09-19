import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";
import type { RequestKind, RequestReceipt as Receipt } from "../model/request.types";

export function RequestReceipt({
    receipt,
    kind,
}: {
    receipt: Receipt;
    kind: RequestKind;
}) {
    const region = useRef<HTMLDivElement>(null);

    useEffect(() => {
        region.current?.focus();
    }, []);

    function download() {
        const document = receipt.document;
        const blob = document
            ? new Blob(
                  [Uint8Array.from(atob(document.contentBase64), (character) => character.charCodeAt(0))],
                  { type: document.mimeType },
              )
            : new Blob([receipt.receipt], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement("a");
        link.href = url;
        link.download = document?.filename ?? `ISOCAL-${receipt.reference}.txt`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    const title =
        kind === "complaint"
            ? "Recibimos tu reclamación"
            : kind === "quotation"
              ? "Solicitud enviada correctamente"
              : "Recibimos tu consulta";

    const description =
        kind === "complaint"
            ? "Te responderemos al correo indicado en un plazo máximo de 15 días hábiles."
            : kind === "quotation"
              ? "Enviamos automáticamente a tu correo la cotización en PDF, con los productos solicitados y los campos de precio sin completar."
              : "El equipo de ISOCAL recibió tus datos y responderá al correo que indicaste.";

    return (
        <div className="co-form-success ix-content-enter" role="status" tabIndex={-1} ref={region}>
            <div className="co-form-success-icon" aria-hidden="true">
                <CorporateIcon name="check" />
            </div>

            <p className="co-form-success-kicker">Confirmación</p>
            <h2>{title}</h2>
            <p>{description}</p>

            <div className="co-form-success-reference">
                <span>Referencia de seguimiento</span>
                <strong>{receipt.reference}</strong>
            </div>

            <div className="co-form-success-actions">
                <button type="button" className="co-button" onClick={download}>
                    <span>{receipt.document ? "Descargar PDF" : "Descargar constancia"}</span>
                    <span aria-hidden="true">↓</span>
                </button>
                <Link className="co-text-link" to="/productos">
                    Explorar productos →
                </Link>
            </div>
        </div>
    );
}
