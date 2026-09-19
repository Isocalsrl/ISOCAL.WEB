import type { ServiceGroup } from "./types";

export const METROLOGY_DESCRIPTION =
    "El portafolio declara servicios de calibración respaldados bajo ISO/IEC 17025. El alcance aplicable debe confirmarse para cada requerimiento.";

export const CALIBRATION_GROUPS: readonly ServiceGroup[] = [
    {
        id: "electroquimicos",
        title: "Electroquímicos",
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
        title: "Temperatura",
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
        title: "Volumen",
        items: [
            "Bureta",
            "Dispensadores",
            "Picnómetros",
            "Medidores Volumétricos de 5 galones (Seraphin)",
            "Dilutores",
            "Micropipetas monocanal",

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
        title: "Flujo de Aire",
        items: [
            "Bombas Succión",
            "Muestreadores de Partículas en Alto Volumen (Hi Vol) y Bajo Volumen (Low Vol)",
            "Variflow",
        ],
    },
    {
        id: "humedad",
        title: "Humedad",
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
        title: "Presión",
        items: [
            "Barómetro",
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
        title: "Tiempo y Frecuencia",
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
        title: "Longitud y Ángulo",
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
        title: "Fotometría y acústica",
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
        title: "Masa",
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
        title: "Caudal",
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
        title: "Equipos de posicionamiento",
        items: ["GPS"],
    },
    {
        id: "equipos-opticos",
        title: "Calibración de Equipos Ópticos",
        items: ["Clorímetros", "Espectrocolorímetro", "Turbidímetros", "Refractómetro"],
    },
    {
        id: "electricidad",
        title: "Electricidad",
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
        title: "Fuerza y Torque",
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
        title: "Velocidad y Viento",
        items: [
            "Anemómetro",
            "Mini estación Meteorológica",
            "Correntómetro",
            "Calibración de Contómetro de tubería cerrada y canal abierto",
        ],
    },
    {
        id: "gases",
        title: "Gases",
        items: [
            "Analizador de gases combustión (CH4), puede reportarse con LEL",
            "Medidor de gas seco",
        ],
    },
    {
        id: "gases-ambientales",
        title: "Analizadores de gases ambientales",
        items: ["SO2", "CO", "NO", "NO2", "H2S", "O3"],
    },
    {
        id: "gases-combustion",
        title: "Analizadores de gases de combustión y detectores de gases",
        items: ["CO", "NO", "NO2", "SO2", "O2", "CO2", "H2S"],
    },
];

export const MAINTENANCE_DESCRIPTION =
    "Servicios de diagnóstico, mantenimiento preventivo y correctivo para los equipos incluidos en el portafolio.";

export const MAINTENANCE_ITEMS: readonly string[] = [
    "Equipos de Monitoreos Ambientales",
    "Equipos Ocupacionales",
    "Equipos de Laboratorio Ambiental",
    "Equipos de Laboratorio Industrial",
    "Equipos de Laboratorio Clínico",
];

export const TESTING_ITEMS: readonly string[] = [
    "Caracterización de salas limpias",
    "Campanas de flujo laminar",

    "Cabinas de seguridad biológica",
    "Mapeos de temperatura, humedad y presión",
];
