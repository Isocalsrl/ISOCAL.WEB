const QUOTE_REFERENCE_PREFIX = "COT";
const QUOTE_REFERENCE_PADDING = 6;

function getLimaYear(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Lima",
        year: "numeric",
    }).format(date);
}

export function buildQuoteReference(
    sequenceNumber: number,
    date = new Date(),
): string {
    return [
        QUOTE_REFERENCE_PREFIX,
        getLimaYear(date),
        String(sequenceNumber).padStart(QUOTE_REFERENCE_PADDING, "0"),
    ].join("-");
}
