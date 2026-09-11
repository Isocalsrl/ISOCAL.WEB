export function toCents(value: number): number {
    return Math.round(value * 100);
}

export function fromCents(value: number): number {
    return value / 100;
}

export function roundMoney(value: number): number {
    return fromCents(toCents(value));
}
