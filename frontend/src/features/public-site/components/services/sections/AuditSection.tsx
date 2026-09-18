import { CorporateIcon } from "../../../../../shared/components/ui/CorporateIcon";
import { AUDIT_GROUPS } from "../../../data/services/audit";

const AUDIT_STANDARDS = [
    "ISO 9001",
    "ISO 14001",
    "ISO 45001",
    "ISO/IEC 17025",
    "ISO 15189",
    "ISO 17020",
] as const;

export function AuditSection() {
    return (
        <section className="ix-section ix-audit-section" id="auditoria">
            <div className="public-container">
                <div className="ix-audit-intro">
                    <div>
                        <p className="ix-kicker">03 / Auditoría</p>
                        <h2>Auditorías de diagnóstico e internas.</h2>
                        <p>
                            Evaluaciones para revisar brechas y cumplimiento en los sistemas de gestión publicados.
                        </p>
                    </div>
                    <img src="/images/services/auditoria.webp" alt="Auditoría de documentación y procesos" loading="lazy" />
                </div>

                <div className="ix-audit-matrix" role="table" aria-label="Esquemas de auditoría de ISOCAL">
                    <div className="ix-audit-matrix-head" role="row">
                        <span role="columnheader">Norma</span>
                        <span role="columnheader">Auditoría de diagnóstico</span>
                        <span role="columnheader">Auditoría interna</span>
                    </div>
                    {AUDIT_STANDARDS.map((standard) => (
                        <div className="ix-audit-matrix-row" role="row" key={standard}>
                            <strong role="cell">{standard}</strong>
                            <span role="cell">
                                <CorporateIcon name="check" /> Incluida
                            </span>
                            <span role="cell">
                                <CorporateIcon name="check" /> Incluida
                            </span>
                        </div>
                    ))}
                </div>
                <div className="ix-audit-notes">
                    {AUDIT_GROUPS.map((group) => (
                        <div key={group.id}>
                            <strong>{group.title}</strong>
                            <span>{group.items.length} esquemas disponibles</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
