import { useMemo, useState } from "react";
import { CONVERTERS, validateAndConvertUnit, type ConverterKind } from "../model/unitConversion";

function formatResult(value: number): string {
    if (Math.abs(value) >= 1_000_000 || (Math.abs(value) > 0 && Math.abs(value) < 0.0001)) {
        return value.toExponential(6);
    }
    return new Intl.NumberFormat("es-PE", { maximumFractionDigits: 8 }).format(value);
}

export function MetrologyConverter() {
    const [kind, setKind] = useState<ConverterKind>("pressure");
    const converter = CONVERTERS.find((item) => item.id === kind) ?? CONVERTERS[0];
    const [value, setValue] = useState("1");
    const [fromByKind, setFromByKind] = useState<Record<ConverterKind, string>>({
        pressure: "psi",
        temperature: "c",
        mass: "kg",
        length: "m",
    });
    const [toByKind, setToByKind] = useState<Record<ConverterKind, string>>({
        pressure: "bar",
        temperature: "f",
        mass: "lb",
        length: "mm",
    });

    const numericValue = value.trim() === "" ? Number.NaN : Number(value.replace(",", "."));
    const conversion = useMemo(
        () => validateAndConvertUnit(kind, numericValue, fromByKind[kind], toByKind[kind]),
        [fromByKind, kind, numericValue, toByKind],
    );
    const targetUnit = converter.units.find((unit) => unit.id === toByKind[kind]);

    return (
        <div className="metrology-converter" id="conversores">
            <div className="metrology-converter-intro">
                <p className="ix-kicker">Conversores</p>
                <h2>Conversión de unidades.</h2>
                <p>Úsalos como referencia rápida. No sustituyen un certificado, procedimiento ni cálculo de incertidumbre.</p>
            </div>

            <div className="converter-kind-tabs" role="tablist" aria-label="Tipo de conversión">
                {CONVERTERS.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={kind === item.id}
                        className={kind === item.id ? "is-active" : ""}
                        onClick={() => setKind(item.id)}
                    >
                        <strong>{item.title}</strong>
                        <small>{item.description}</small>
                    </button>
                ))}
            </div>

            <div className="converter-panel">
                <label>
                    <span>Valor</span>
                    <input inputMode="decimal" value={value} onChange={(event) => setValue(event.target.value)} />
                </label>
                <label>
                    <span>Desde</span>
                    <select
                        value={fromByKind[kind]}
                        onChange={(event) => setFromByKind((current) => ({ ...current, [kind]: event.target.value }))}
                    >
                        {converter.units.map((unit) => <option key={unit.id} value={unit.id}>{unit.label} ({unit.symbol})</option>)}
                    </select>
                </label>
                <button
                    className="converter-swap"
                    type="button"
                    onClick={() => {
                        const from = fromByKind[kind];
                        const to = toByKind[kind];
                        setFromByKind((current) => ({ ...current, [kind]: to }));
                        setToByKind((current) => ({ ...current, [kind]: from }));
                    }}
                    aria-label="Intercambiar unidades"
                    title="Intercambiar unidades"
                >
                    ⇄
                </button>
                <label>
                    <span>Hacia</span>
                    <select
                        value={toByKind[kind]}
                        onChange={(event) => setToByKind((current) => ({ ...current, [kind]: event.target.value }))}
                    >
                        {converter.units.map((unit) => <option key={unit.id} value={unit.id}>{unit.label} ({unit.symbol})</option>)}
                    </select>
                </label>
                <div className="converter-result" aria-live="polite">
                    <small>Resultado</small>
                    <strong>{conversion.value === null ? "—" : formatResult(conversion.value)}</strong>
                    <span>{conversion.error === "below-absolute-zero" ? "No puede ser menor a 0 K" : conversion.value === null ? "Ingresa un valor válido" : targetUnit?.symbol}</span>
                </div>
            </div>
        </div>
    );
}
