import { useState } from "react";
import { Link } from "react-router-dom";
import { CALIBRATION_GROUPS } from "../data/services/metrology";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";

export function CalibrationExplorer() {
    const [selectedId, setSelectedId] = useState(CALIBRATION_GROUPS[1].id);
    const selected = CALIBRATION_GROUPS.find((group) => group.id === selectedId)!;

    return (
        <div className="co-calibration-explorer">
            <div className="co-calibration-options">
                <div className="co-calibration-options-head">
                    <span className="co-calibration-options-icon" aria-hidden="true">
                        <CorporateIcon name="ruler" />
                    </span>
                    <div>
                        <span>Área de calibración</span>
                        <strong>{CALIBRATION_GROUPS.length} magnitudes disponibles</strong>
                    </div>
                </div>

                <label className="co-calibration-select">
                    <span>Selecciona un área</span>
                    <span className="co-calibration-select-control">
                        <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
                            {CALIBRATION_GROUPS.map((group) => (
                                <option key={group.id} value={group.id}>{group.title}</option>
                            ))}
                        </select>
                        <CorporateIcon name="chevron" />
                    </span>
                </label>

                <div className="co-calibration-buttons" role="group" aria-label="Categorías de calibración">
                    {CALIBRATION_GROUPS.map((group, index) => (
                        <button
                            type="button"
                            key={group.id}
                            aria-pressed={group.id === selectedId}
                            aria-controls="calibration-detail"
                            onClick={() => setSelectedId(group.id)}
                        >
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <strong>{group.title}</strong>
                            <CorporateIcon name="arrow" />
                        </button>
                    ))}
                </div>
            </div>

            <section className="co-calibration-detail" id="calibration-detail" aria-labelledby="calibration-title">
                <div className="co-calibration-detail-heading">
                    <div>
                        <span className="co-eyebrow">Equipos que calibramos</span>
                        <h3 id="calibration-title">{selected.title}</h3>
                    </div>
                    <span className="co-technical-label">METROLOGÍA</span>
                </div>
                <ul key={selectedId}>
                    {selected.items.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
                <div className="co-calibration-detail-footer">
                    <p>Consulta el rango y el alcance de calibración para tu instrumento.</p>
                    <Link className="co-button" to={`/contacto?servicio=${encodeURIComponent(`Calibración · ${selected.title}`)}`}>
                        Consultar calibración <CorporateIcon name="arrow" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
