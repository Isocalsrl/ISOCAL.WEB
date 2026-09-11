export interface ServiceNavigationItem {
    id: string;
    number: string;
    title: string;
    description: string;
}

export interface ServiceGroup {
    id: string;
    title: string;
    items: readonly string[];
}

export const SERVICE_NAVIGATION:
    readonly ServiceNavigationItem[] = [
        {
            id: "metrologia",
            number: "01",
            title: "Metrología",
            description:
                "Calibración, mantenimiento y ensayos para equipos, instrumentos y ambientes técnicos.",
        },
        {
            id: "consultoria",
            number: "02",
            title: "Consultoría",
            description:
                "Implementación, capacitación y acompañamiento para sistemas de gestión y normas ISO.",
        },
        {
            id: "auditoria",
            number: "03",
            title: "Auditoría",
            description:
                "Evaluaciones de diagnóstico e internas para sistemas de gestión y laboratorios.",
        },
    ];

export const METROLOGY_DESCRIPTION =
    "Todos los servicios de calibración son respaldados por una acreditación bajo el estándar ISO 17025.";

export const CALIBRATION_GROUPS:
    readonly ServiceGroup[] = [
        {
            id: "electroquimicos",
            title:
                "Electroquímicos",
            items: [
                "Medidores de pH",
                "Conductímetros",
                "Medidor de Oxígeno Disuelto",
                "Multímetros (pH, CE, OD, TDS, Salinidad)",
                "Alcoholímetros",
                "Multiparámetro ORP",
                "Medidor TSS",
            ],
        },
        {
            id: "temperatura",
            title:
                "Temperatura",
            items: [
                "Autoclaves",
                "Hornos y Muflas",
                "Baños Termostáticos",
                "Cámaras de Frío",
                "Congeladoras y Ultracongeladoras",
                "Datalogger’s",
                "Planchas de Calentamiento",
                "Pozo Seco",
                "Refrigeradoras y Conservadoras",
                "Termómetros Ambientales",
                "Termómetros digitales",
                "Termómetros de líquidos de vidrio",
                "Transmisor de temperatura",
                "Termómetros Infrarrojos (IR)",
            ],
        },
        {
            id: "volumen",
            title:
                "Volumen",
            items: [
                "Bureta",
                "Dispensadores",
                "Picnómetros",
                "Medidores Volumétricos de 5 galones (Seraphin)",
                "Dilutores",

                // TODO:
                // El Portafolio ISOCAL 2025 muestra literalmente
                // "Micropipetas monocanal- Voltaje AC".
                // Confirmar con ISOCAL antes del deploy final.
                "Micropipetas monocanal- Voltaje AC",

                "Micropipetas multicanal 12 canales",
                "Micropipetas multicanal 8 canales",
                "Aparatos de pistón",
                "Cono Imhoff",
                "Matraz de un trazo",
                "Pipetas de un trazo",
                "Pipetas graduadas",
                "Probetas graduadas",
            ],
        },
        {
            id: "flujo-aire",
            title:
                "Flujo de Aire",
            items: [
                "Bombas Succión",
                "Muestreadores de Partículas en Alto Volumen (Hi Vol) y Bajo Volumen (Low Vol)",
                "Variflow",
            ],
        },
        {
            id: "humedad",
            title:
                "Humedad",
            items: [
                "Termohigrómetro",
                "Registrador de humedad",
                "Higrómetro y Psicrómetro",
                "Cámaras climáticas",
                "Estaciones meteorológicas",
                "Estrés térmico",
                "Digestor DQO",
            ],
        },
        {
            id: "presion",
            title:
                "Presión",
            items: [
                "Barómetro",

                // TODO:
                // El Portafolio ISOCAL 2025 muestra literalmente
                // "Equipos Automaticos y low".
                // Confirmar el nombre técnico con ISOCAL.
                "Equipos Automáticos y low",

                "Medidor de presión / vacío",
                "Manómetro diferencial",
                "Manómetro analógico / digital",
                "Registrador de presión",
                "Transductor de presión",
            ],
        },
        {
            id: "tiempo-frecuencia",
            title:
                "Tiempo y Frecuencia",
            items: [
                "Tacómetros",
                "Estroboscopio",
                "Frecuencímetro",
                "Cronómetro",
                "Microcentrífugas",
                "Vibrómetro",
            ],
        },
        {
            id: "longitud-angulo",
            title:
                "Longitud y Ángulo",
            items: [
                "Pie de Rey",
                "Micrómetro",
                "Reloj comparador",
                "Alesómetro",
                "Cinta métrica",
                "Regla",
                "Cuenta Hilos",
                "Inclinómetro",
                "Mallas Reticuladas",
                "Medidor de espesores",
                "Galgas",
                "Regla y Escuadra Metálica",
                "Tamiz",
                "Vernier o Pie de Rey",
                "Goniómetro",
                "Brújula",
            ],
        },
        {
            id: "fotometria-acustica",
            title:
                "Fotometría y acústica",
            items: [
                "Espectrofotómetros",
                "Refractómetros",
                "Luxómetros",
                "Sonómetros Clase 1 y 2",
                "Dosímetros",
                "Calibradores Acústicos",
            ],
        },
        {
            id: "masa",
            title:
                "Masa",
            items: [
                "Balanzas de clase I y II",
                "Balanzas de clase III y IIII",
                "Tolvas de pesaje",
                "Celdas de carga",
                "Pesas clase M1 y M2",
                "Pesas E2",
                "Pesas F1 y F2",
            ],
        },
        {
            id: "caudal",
            title:
                "Caudal",
            items: [
                "Flujómetros",
                "Muestreadores de Partículas",
                "Caudalímetros de Gases",
                "Rotámetros",
                "Bombas Ocupacionales",
                "Medidores de gas seco",
            ],
        },
        {
            id: "posicionamiento",
            title:
                "Equipos de posicionamiento",
            items: [
                "GPS",
            ],
        },
        {
            id: "equipos-opticos",
            title:
                "Calibración de Equipos Ópticos",
            items: [
                "Clorímetros",
                "Espectrocolorímetro",
                "Turbidímetros",
                "Refractómetro",
            ],
        },
        {
            id: "electricidad",
            title:
                "Electricidad",
            items: [
                "Megóhmetro",
                "Pinzas Amperimétricas",
                "Multímetros",
                "Calibrador",
                "Fasímetros",
                "Medidores de Tensión",
                "Medidores de Energía Eléctrica",
                "Telurómetros",
                "Voltímetros",
                "Aislador eléctrico por radiofrecuencia",
                "Detector de Tormentas",
                "Localizador de Líneas Metálicas",
            ],
        },
        {
            id: "fuerza-torque",
            title:
                "Fuerza y Torque",
            items: [
                "Penetrómetro",
                "Torquímetros",
                "Dinamómetros",
                "Prensa Hidráulica",
                "Tensiómetro",
                "Equipos de Tracción y Compresión",
            ],
        },
        {
            id: "velocidad-viento",
            title:
                "Velocidad y Viento",
            items: [
                "Anemómetro",
                "Mini estación Meteorológica",
                "Correntómetro",
                "Calibración de Contómetro de tubería cerrada y canal abierto",
            ],
        },
        {
            id: "gases",
            title:
                "Gases",
            items: [
                "Analizador de gases combustión (CH4), puede reportarse con LEL",
                "Medidor de gas seco",
            ],
        },
        {
            id: "gases-ambientales",
            title:
                "Analizadores de gases ambientales",
            items: [
                "SO2",
                "CO",
                "NO",
                "NO2",
                "H2S",
                "O3",
            ],
        },
        {
            id: "gases-combustion",
            title:
                "Analizadores de gases de combustión y detectores de gases",
            items: [
                "CO",
                "NO",
                "NO2",
                "SO2",
                "O2",
                "CO2",
                "H2S",
            ],
        },
    ];

export const MAINTENANCE_DESCRIPTION =
    "Contamos con instalaciones y condiciones adecuadas para la atención a servicios de diagnóstico, mantenimiento preventivo y correctivo.";

export const MAINTENANCE_ITEMS:
    readonly string[] = [
        "Equipos de Monitoreos Ambientales",
        "Equipos Ocupacionales",
        "Equipos de Laboratorio Ambiental",
        "Equipos de Laboratorio Industrial",
        "Equipos de Laboratorio Clínico",
    ];

export const TESTING_ITEMS:
    readonly string[] = [
        "Caracterización de salas limpias",

        // TODO:
        // El Portafolio ISOCAL 2025 muestra literalmente
        // "Campas de flujo laminar".
        // Confirmar si corresponde a "Campanas de flujo laminar".
        "Campas de flujo laminar",

        "Cabinas de seguridad biológica",
        "Mapeos de temperatura, humedad y presión",
    ];

export const CONSULTING_DESCRIPTION =
    "En ISOCAL encontrarás una consultoría especializada en la implementación y capacitación para la certificación de diversas normativas ISO. Nuestro equipo acompaña el proceso desde la evaluación inicial hasta la certificación final, proporcionando herramientas y conocimientos para cumplir los requisitos aplicables y mejorar continuamente el desempeño empresarial.";

export const CONSULTING_STANDARDS:
    readonly string[] = [
        "ISO/IEC 17025",
        "ISO/IEC 17020",
        "ISO 9001",
        "ISO 14001",
        "ISO 45001",
    ];

export const CONSULTING_OUTCOME =
    "Confiar en nosotros es confiar en tu capacidad para impulsar la eficiencia, la eficacia y la reputación de tu empresa a nivel nacional o internacional.";

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