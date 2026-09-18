import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";
import { CALIBRATION_GROUPS } from "../../public-site/data/services/metrology";

interface EquipmentOption {
    equipment: string;
    groupId: string;
    groupTitle: string;
}

type ServiceNeed = "calibrar" | "verificar" | "mantenimiento" | "no-seguro";

const SERVICE_NEEDS: ReadonlyArray<{ id: ServiceNeed; label: string; detail: string }> = [
    { id: "calibrar", label: "Calibrar", detail: "Buscar la capacidad de calibración relacionada." },
    { id: "verificar", label: "Verificar", detail: "Indicar que necesitas una verificación." },
    { id: "mantenimiento", label: "Mantenimiento", detail: "Revisar opciones de mantenimiento." },
    { id: "no-seguro", label: "No estoy seguro", detail: "Continuar para pedir orientación." },
];

const EQUIPMENT_OPTIONS: readonly EquipmentOption[] = CALIBRATION_GROUPS.flatMap((group) =>
    group.items.map((equipment) => ({ equipment, groupId: group.id, groupTitle: group.title })),
);

export function ServiceAdvisor() {
    const [step, setStep] = useState(1);
    const [equipment, setEquipment] = useState("");
    const [groupId, setGroupId] = useState("");
    const [serviceNeed, setServiceNeed] = useState<ServiceNeed | "">("");
    const [range, setRange] = useState("");

    const selectedGroup = useMemo(
        () => CALIBRATION_GROUPS.find((group) => group.id === groupId) ?? null,
        [groupId],
    );

    const recommendationTitle = serviceNeed === "mantenimiento"
        ? "Mantenimiento de equipos"
        : `Calibración de instrumentos · ${selectedGroup?.title ?? ""}`;
    const serviceHref = serviceNeed === "mantenimiento" ? "/servicios#mantenimiento" : "/servicios#metrologia";

    const contactHref = useMemo(() => {
        const params = new URLSearchParams();
        params.set("servicio", recommendationTitle);
        if (equipment) params.set("equipo", equipment);
        if (range.trim()) params.set("rango", range.trim());
        return `/contacto?${params.toString()}`;
    }, [equipment, range, recommendationTitle]);

    function chooseEquipment(value: string) {
        setEquipment(value);
        const match = EQUIPMENT_OPTIONS.find((option) => option.equipment === value);
        setGroupId(match?.groupId ?? "");
    }

    function reset() {
        setStep(1);
        setEquipment("");
        setGroupId("");
        setServiceNeed("");
        setRange("");
    }

    return (
        <div className="service-advisor" id="orientador">
            <div className="service-advisor-header">
                <div>
                    <p className="ix-kicker">Orientador técnico</p>
                    <h2>¿Qué servicio necesito?</h2>
                    <p>Te ayuda a ubicar un servicio publicado. El alcance final debe confirmarlo el equipo técnico.</p>
                </div>
                <div className="service-advisor-progress" aria-label={`Paso ${step} de 4`}>
                    {[1, 2, 3, 4].map((number) => (
                        <span key={number} className={number <= step ? "is-active" : ""}>{number}</span>
                    ))}
                </div>
            </div>

            <div className="service-advisor-panel">
                {step === 1 && (
                    <div className="service-advisor-step">
                        <span className="service-advisor-number">01</span>
                        <div>
                            <small>Tengo un equipo</small>
                            <h3>¿Qué equipo necesitas atender?</h3>
                            <p>Selecciona uno del portafolio. Si no aparece, puedes continuar por magnitud.</p>
                        </div>
                        <label>
                            <span>Equipo o instrumento</span>
                            <select value={equipment} onChange={(event) => chooseEquipment(event.target.value)}>
                                <option value="">Selecciona un equipo</option>
                                <option value="__other__">No encuentro mi equipo</option>
                                {CALIBRATION_GROUPS.map((group) => (
                                    <optgroup key={group.id} label={group.title}>
                                        {group.items.map((item) => <option key={`${group.id}-${item}`} value={item}>{item}</option>)}
                                    </optgroup>
                                ))}
                            </select>
                        </label>
                        <button className="ix-button ix-button-primary" type="button" disabled={!equipment} onClick={() => setStep(2)}>
                            Continuar <CorporateIcon name="arrow" />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="service-advisor-step">
                        <span className="service-advisor-number">02</span>
                        <div>
                            <small>Magnitud</small>
                            <h3>{groupId ? "Detectamos una magnitud relacionada." : "¿Qué magnitud necesitas medir?"}</h3>
                            <p>{equipment === "__other__" ? "Elige la magnitud más cercana a tu necesidad." : `Equipo seleccionado: ${equipment}`}</p>
                        </div>
                        <label>
                            <span>Magnitud técnica</span>
                            <select value={groupId} onChange={(event) => setGroupId(event.target.value)}>
                                <option value="">Selecciona una magnitud</option>
                                {CALIBRATION_GROUPS.map((group) => <option key={group.id} value={group.id}>{group.title}</option>)}
                            </select>
                        </label>
                        <div className="service-advisor-needs" role="group" aria-label="Necesidad principal">
                            <span>¿Qué necesitas hacer?</span>
                            <div>
                                {SERVICE_NEEDS.map((need) => (
                                    <button
                                        key={need.id}
                                        className={serviceNeed === need.id ? "is-selected" : ""}
                                        type="button"
                                        onClick={() => setServiceNeed(need.id)}
                                    >
                                        <strong>{need.label}</strong><small>{need.detail}</small>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="service-advisor-actions">
                            <button className="ix-button ix-button-ghost" type="button" onClick={() => setStep(1)}>Atrás</button>
                            <button className="ix-button ix-button-primary" type="button" disabled={!groupId || !serviceNeed} onClick={() => setStep(3)}>
                                Continuar <CorporateIcon name="arrow" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="service-advisor-step">
                        <span className="service-advisor-number">03</span>
                        <div>
                            <small>Rango de trabajo</small>
                            <h3>¿Conoces el rango aproximado?</h3>
                            <p>Es opcional. Ejemplos: 0–300 PSI, -20 a 150 °C, 0–20 kg.</p>
                        </div>
                        <label>
                            <span>Rango o condición de operación</span>
                            <input value={range} onChange={(event) => setRange(event.target.value)} placeholder="Ej.: 0–300 PSI" />
                        </label>
                        <div className="service-advisor-actions">
                            <button className="ix-button ix-button-ghost" type="button" onClick={() => setStep(2)}>Atrás</button>
                            <button className="ix-button ix-button-primary" type="button" onClick={() => setStep(4)}>
                                Ver recomendación <CorporateIcon name="arrow" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && selectedGroup && (
                    <div className="service-advisor-result">
                        <div className="service-advisor-result-mark"><CorporateIcon name="check" /></div>
                        <div>
                            <p className="ix-kicker">Servicio recomendado</p>
                            <h3>{recommendationTitle}</h3>
                            <p>
                                La recomendación se basa en el portafolio publicado. El equipo técnico debe confirmar el alcance y las condiciones finales.
                            </p>
                            <dl>
                                {equipment && equipment !== "__other__" && <><dt>Equipo</dt><dd>{equipment}</dd></>}
                                <dt>Magnitud</dt><dd>{selectedGroup.title}</dd>
                                <dt>Necesidad</dt><dd>{SERVICE_NEEDS.find((item) => item.id === serviceNeed)?.label}</dd>
                                {range.trim() && <><dt>Rango indicado</dt><dd>{range.trim()}</dd></>}
                            </dl>
                            <div className="service-advisor-actions">
                                <Link className="ix-button ix-button-primary" to={contactHref}>Consultar servicio <CorporateIcon name="arrow" /></Link>
                                <Link className="ix-button ix-button-ghost" to={serviceHref}>Ver servicio</Link>
                                <button className="technical-text-button" type="button" onClick={reset}>Empezar de nuevo</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
