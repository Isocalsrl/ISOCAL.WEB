export const CONTACT_FOCUS_AREAS = [
    "Calibración por magnitud e instrumento",
    "Mantenimiento y continuidad operativa",
    "Ensayos y caracterización de ambientes técnicos",
    "Consultoría y capacitación en normas ISO",
    "Auditoría de diagnóstico e interna",
    "Equipos, insumos y alquiler",
] as const;

export const CONTACT_REQUEST_STEPS = [
    {
        number: "01",
        title: "Revisamos la necesidad",
        description: "Revisamos el equipo, servicio o contexto que indicas en el formulario.",
    },
    {
        number: "02",
        title: "Derivamos al área correspondiente",
        description: "La solicitud se deriva al área relacionada con metrología, mantenimiento, ensayos, consultoría, auditoría o equipamiento.",
    },
    {
        number: "03",
        title: "Respondemos con orientación o cotización",
        description: "El equipo responde por correo o mediante el canal comercial indicado.",
    },
] as const;

export const CONTACT_QUOTE_HINTS = [
    "Tipo de servicio o equipo",
    "Marca y modelo",
    "Rango o magnitud de medición",
    "Ciudad o ubicación",
] as const;
