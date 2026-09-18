export interface IntegratedPolicyPrinciple {
    number: string;
    title: string;
    description: string;
}

export interface LaboratoryPartner {
    id: string;
    name: string;
    logo: string;
    logoAlt: string;
}

export interface AboutSector {
    number: string;
    title: string;
    description: string;
}

export interface AboutServicePillar {
    number: string;
    title: string;
    description: string;
    detail: string;
}

export const ABOUT_OVERVIEW =
    "ISOCAL articula una red de laboratorios acreditados por INACAL, A2LA y PJLA para atender servicios de metrología dirigidos a minería, manufactura y laboratorios.";

export const ABOUT_ACCREDITATION_BODIES = [
    "INACAL",
    "A2LA",
    "PJLA",
] as const;

export const INTEGRATED_POLICY_PRINCIPLES:
    readonly IntegratedPolicyPrinciple[] = [
        {
            number: "01",
            title:
                "Competencia técnica e imparcialidad",
            description:
                "Realizar las actividades con competencia técnica, imparcialidad y criterios de trabajo coherentes.",
        },
        {
            number: "02",
            title:
                "Satisfacción del cliente",
            description:
                "Atender los requisitos del cliente y mejorar su nivel de satisfacción.",
        },
        {
            number: "03",
            title:
                "Cumplimiento",
            description:
                "Cumplir los requisitos aplicables de nuestros clientes, nuestro sistema de gestión y los requisitos legales.",
        },
        {
            number: "04",
            title:
                "Mejora continua",
            description:
                "Mejorar continuamente nuestro sistema integrado de gestión.",
        },
        {
            number: "05",
            title:
                "Partes interesadas",
            description:
                "Buscar satisfacer las necesidades y expectativas de las partes interesadas.",
        },
    ];

export const INTEGRATED_POLICY_COMMITMENT =
    "La política reúne los compromisos de calidad, cumplimiento y mejora continua del sistema de gestión.";

export const LABORATORY_NETWORK_DESCRIPTION =
    "La red metrológica incorpora laboratorios acreditados y especializados para ampliar la atención según el tipo de servicio requerido.";

export const LABORATORY_PARTNERS:
    readonly LaboratoryPartner[] = [
        {
            id: "gesmin",
            name: "GESMIN",
            logo:
                "/images/partners/gesmin.svg",
            logoAlt:
                "Logotipo de GESMIN",
        },
        {
            id: "alab",
            name: "ALAB",
            logo:
                "/images/partners/alab.svg",
            logoAlt:
                "Logotipo de ALAB",
        },
        {
            id: "fesepsa",
            name: "FESEPSA",
            logo:
                "/images/partners/fesepsa.svg",
            logoAlt:
                "Logotipo de FESEPSA",
        },
        {
            id: "ams-test",
            name: "AMS Test",
            logo:
                "/images/partners/ams-test.svg",
            logoAlt:
                "Logotipo de AMS Test",
        },
    ];

export const ABOUT_SECTORS: readonly AboutSector[] = [
    {
        number: "01",
        title: "Minería",
        description:
            "Servicios metrológicos y soporte técnico para equipos e instrumentos utilizados en operaciones mineras.",
    },
    {
        number: "02",
        title: "Manufactura",
        description:
            "Servicios para procesos productivos, control de calidad, equipos de medición y sistemas de gestión.",
    },
    {
        number: "03",
        title: "Laboratorios",
        description:
            "Servicios para laboratorios de ensayo, calibración y laboratorios clínicos, incluyendo formación técnica.",
    },
];

export const ABOUT_SERVICE_PILLARS: readonly AboutServicePillar[] = [
    {
        number: "01",
        title: "Metrología",
        description:
            "Calibración bajo ISO/IEC 17025, mantenimiento de equipos y ensayos para ambientes y condiciones técnicas.",
        detail: "19 áreas técnicas dentro del portafolio institucional.",
    },
    {
        number: "02",
        title: "Consultoría y capacitación",
        description:
            "Implementación, acompañamiento y formación en normas ISO orientadas a laboratorios, calidad, ambiente y seguridad.",
        detail: "ISO/IEC 17025 · ISO/IEC 17020 · ISO 9001 · ISO 14001 · ISO 45001.",
    },
    {
        number: "03",
        title: "Auditoría",
        description:
            "Auditorías de diagnóstico e internas para revisar brechas y cumplimiento de los sistemas de gestión.",
        detail: "Cobertura para ISO 9001, ISO 14001, ISO 45001, ISO/IEC 17025, ISO 15189 e ISO 17020.",
    },
    {
        number: "04",
        title: "Equipos e insumos",
        description:
            "Venta y alquiler de equipos e insumos para laboratorio e industria.",
        detail: "Consulta comercial para equipamiento, instrumentación y alquiler de equipos.",
    },
];
