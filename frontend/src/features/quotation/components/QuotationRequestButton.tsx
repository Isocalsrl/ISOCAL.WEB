import { QuotationIcon } from "./QuotationIcon";

interface QuotationRequestButtonProps {
    onRequest: () => void;
    disabled?: boolean;
}

export function QuotationRequestButton({ onRequest, disabled = false }: QuotationRequestButtonProps) {
    return (
        <button className="quotation-request-button" type="button" onClick={onRequest} disabled={disabled}>
            <QuotationIcon />
            <span>Solicitar cotización</span>
        </button>
    );
}
