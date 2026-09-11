import type {
    ServiceGroup,
} from "./types";

export const AUDIT_DESCRIPTION =
    "Nuestras auditorías están diseñadas para conferir alto valor técnico y de gestión. El equipo de auditores y expertos técnicos realiza evaluaciones orientadas a identificar oportunidades de mejora en procesos, sistemas y prácticas operativas para asegurar el cumplimiento de las normativas aplicables.";

export const AUDIT_OUTCOME =
    "Mediante informes detallados y recomendaciones personalizadas, nuestros clientes pueden tomar decisiones informadas y fortalecer la eficiencia, la transparencia y la confiabilidad de su organización.";

export const AUDIT_GROUPS:
    readonly ServiceGroup[] = [
        {
            id: "auditorias-diagnostico",
            title:
                "Auditorías de Diagnóstico",
            items: [
                "Auditoría de Diagnóstico del Sistema de Gestión de Calidad ISO 9001",
                "Auditoría de Diagnóstico de Sistema de Gestión Ambiental ISO 14001",
                "Auditoría de Diagnóstico de Sistema de Gestión de la Seguridad y Salud en el Trabajo ISO 45001",
                "Auditoría de Diagnóstico de Sistema de Gestión de Laboratorio de Ensayos y Calibración ISO/IEC 17025",
                "Auditoría de Diagnóstico de Sistema de Gestión de Laboratorios clínicos ISO 15189",
                "Auditoría de Diagnóstico de Sistema de Gestión de inspección ISO 17020",
            ],
        },
        {
            id: "auditorias-internas",
            title:
                "Auditorías Internas",
            items: [
                "Auditoría Interna del Sistema de Gestión de Calidad ISO 9001",
                "Auditoría Interna de Sistema de Gestión Ambiental ISO 14001",
                "Auditoría Interna de Sistema de Gestión de la Seguridad y Salud en el Trabajo ISO 45001",
                "Auditoría Interna de Sistema de Gestión de Laboratorio de Ensayos y Calibración ISO/IEC 17025",
                "Auditoría Interna de Sistema de Gestión de Laboratorios clínicos ISO 15189",
                "Auditoría Interna de Sistema de Gestión de inspección de ISO 17020",
            ],
        },
    ];