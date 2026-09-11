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

export const ABOUT_OVERVIEW =
    "Somos una red metrológica compuesta por laboratorios acreditados por el INACAL, A2LA y PJLA, enfocados en brindar servicios integrales de metrología para la industria: minería, manufactura y laboratorios.";

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
                "Realizar nuestras actividades con el objetivo de garantizar competencia técnica, imparcialidad y una operación coherente.",
        },
        {
            number: "02",
            title:
                "Satisfacción del cliente",
            description:
                "Realizar nuestras actividades con el objetivo de mejorar la satisfacción de nuestros clientes.",
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
    "Esta política responde a nuestro total compromiso con la calidad, la confianza y la satisfacción de nuestros clientes y partes interesadas.";

export const LABORATORY_NETWORK_DESCRIPTION =
    "Siempre hemos estado en busca de nuevas formas de mejorar nuestros servicios y ofrecer cada vez mayor valor a nuestros clientes. Por ello, hemos integrado a nuestra red metrológica laboratorios acreditados y especializados.";

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