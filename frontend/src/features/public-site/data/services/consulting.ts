import type { ServiceGroup } from "./types";

export const CONSULTING_DESCRIPTION =
    "Consultoría y capacitación para implementar sistemas de gestión, interpretar requisitos y preparar a la organización según las normas ISO publicadas en el portafolio.";

export const CONSULTING_STANDARDS:
    readonly string[] = [
        "ISO/IEC 17025",
        "ISO/IEC 17020",
        "ISO 9001",
        "ISO 14001",
        "ISO 45001",
    ];

export const CONSULTING_OUTCOME =
    "El alcance se define según la norma, el estado del sistema de gestión y la necesidad de la organización.";

export const TRAINING_GROUPS:
    readonly ServiceGroup[] = [
        {
            id: "interpretacion-normas",
            title:
                "Interpretación de normas",
            items: [
                "Interpretación de la Norma NTP-ISO/IEC 17025 y Directrices de INACAL",
                "Interpretación de la Norma NTP-ISO/IEC 17020 y Directrices de INACAL",
                "Interpretación de la Norma NTP-ISO/IEC 15189 y Directrices de INACAL",
                "Interpretación de la Norma ISO 9001",
                "Interpretación de la Norma ISO 14001",
                "Interpretación de la Norma ISO 45001",
            ],
        },
        {
            id: "gestion-metrologica",
            title:
                "Metrología, métodos y aseguramiento",
            items: [
                "Capacitación Metrológica del Equipamiento de Laboratorios",
                "Herramientas Estadísticas aplicadas al Laboratorio en el Marco de la ISO/IEC 17025:2017",
                "Desarrollo, validación y verificación de métodos de Ensayos y/o Procedimientos de Calibración en el Marco de la ISO/IEC 17025",
                "Ensayos y/o Procedimientos de Calibración en el Marco de la ISO/IEC 17025",
                "Aseguramiento de la validez de los resultados",
                "Participación y evaluación de Ensayos de Aptitud a Través Comparaciones Interlaboratorio",
                "Interpretación de la Norma ISO 10012 “Sistema de Gestión de las Mediciones”",
            ],
        },
        {
            id: "procedimientos-calibracion",
            title:
                "Procedimientos de calibración",
            items: [
                "Procedimiento de Calibración de Medios Isotermos con aire como medio termostático",
                "Procedimiento de Calibración de Termómetros",
                "Procedimiento de Calibración de Termohigrómetros",
                "Procedimiento de Calibración de Cámaras Climáticas",
                "Procedimiento de Calibración de Espectrofotómetros",
                "Procedimiento de Calibración de Medidores de pH",
                "Procedimiento de calibración de Medidores de Conductividad Electrolítica (Conductímetros)",
                "Procedimiento de Calibración de Multímetros y Pinzas Amperimétricas",
                "Procedimiento de Calibración de Material Volumétrico",
            ],
        },
    ];
