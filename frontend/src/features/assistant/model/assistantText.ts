const STOP_WORDS = new Set([
    "a", "al", "algo", "como", "con", "cual", "cuales", "de", "del", "el", "ella", "en", "es", "esa", "ese",
    "eso", "esta", "este", "esto", "hay", "la", "las", "lo", "los", "me", "mi", "para", "por", "que", "se",
    "si", "su", "sus", "tienen", "tiene", "un", "una", "uno", "y", "yo",
]);

const CANONICAL_PREFIXES: ReadonlyArray<readonly [string, string]> = [
    ["cotiz", "cotizacion"], ["compra", "compra"], ["vend", "venta"], ["alquil", "alquiler"],
    ["implement", "implementacion"], ["conviert", "conversion"],
    ["manten", "mantenimiento"], ["audit", "auditoria"], ["capacit", "capacitacion"], ["consultori", "consultoria"],
    ["acredit", "acreditacion"], ["product", "producto"], ["servici", "servicio"], ["herramient", "herramienta"],
    ["favorit", "favorito"], ["articul", "articulo"], ["telefon", "telefono"], ["ubic", "ubicacion"], ["direccion", "ubicacion"],
    ["contact", "contacto"], ["convert", "conversion"], ["transform", "conversion"], ["medici", "medicion"], ["manometr", "manometro"], ["sonometr", "sonometro"], ["luxometr", "luxometro"],
    ["multimetr", "multimetro"], ["termometr", "termometro"], ["micrometr", "micrometro"], ["torquimetr", "torquimetro"],
    ["electric", "electrica"], ["industrial", "industrial"], ["laboratori", "laboratorio"],
    ["metrolog", "metrologia"], ["sector", "sector"], ["politic", "politica"], ["marca", "marca"],
];

const TOKEN_ALIASES: Readonly<Record<string, readonly string[]>> = {
    manometro: ["presion", "psi", "barometro", "transductor"],
    psi: ["presion", "manometro", "bar"],
    bar: ["presion", "manometro", "psi"],
    balanza: ["masa", "peso", "pesas"],
    peso: ["masa", "balanza", "pesas"],
    termometro: ["temperatura", "termohigrometro"],
    temperatura: ["termometro", "horno", "mufla", "camara", "autoclave"],
    humedad: ["termohigrometro", "higrometro", "psicrometro"],
    ph: ["electroquimicos", "medidor"],
    luxometro: ["fotometria", "iluminacion"],
    sonometro: ["acustica", "ruido"],
    ruido: ["sonometro", "acustica"],
    multimetro: ["electricidad", "electrica"],
    amperimetrica: ["electricidad", "pinza"],
    vernier: ["longitud", "calibrador", "pie", "rey"],
    micrometro: ["longitud", "dimensional"],
    torque: ["fuerza", "torquimetro"],
    torquimetro: ["torque", "fuerza"],
    caudal: ["flujo", "caudalimetro", "rotametro"],
    gas: ["gases", "detector", "analizador"],
    gases: ["gas", "detector", "analizador"],
    renta: ["alquiler"],
    rentar: ["alquiler"],
    precio: ["cotizacion", "costo"],
    costo: ["cotizacion", "precio"],
    presupuesto: ["cotizacion"],
    whatsapp: ["contacto", "telefono"],
    correo: ["email", "contacto"],
    mail: ["email", "contacto"],
    iso17025: ["iso", "17025", "acreditacion"],
};

export function normalizeAssistantText(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/iso\s*\/?iec\s*/g, "iso ")
        .replace(/\bntp[-\s]*iso\b/g, "iso")
        .replace(/\biso(?=\d{4,5}\b)/g, "iso ")
        .replace(/[^a-z0-9°./+%-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function canonicalizeToken(token: string): string {

    if (token.startsWith("calibrador")) return "calibrador";
    if (/^calibr(?:ar|an|amos|ando|ado|ada|ados|adas|acion|aciones)$/.test(token)) return "calibracion";
    if (/^(?:wh?a?t?s?a?p+|wsp|wsap|wasap|guasap)$/.test(token)) return "whatsapp";
    for (const [prefix, canonical] of CANONICAL_PREFIXES) {
        if (token.startsWith(prefix)) return canonical;
    }
    return token;
}

export function tokenizeAssistantText(value: string, includeAliases = true): string[] {
    const raw = normalizeAssistantText(value)
        .split(" ")
        .filter(Boolean)
        .map((token) => token.replace(/^[./+%-]+|[./+%-]+$/g, ""))
        .filter(Boolean)
        .map(canonicalizeToken);
    const result = new Set(raw.filter((token) => token.length > 1 && !STOP_WORDS.has(token)));
    if (includeAliases) {
        for (const token of [...result]) {
            for (const alias of TOKEN_ALIASES[token] ?? []) result.add(canonicalizeToken(alias));
        }
    }
    return [...result];
}

export function hasNormalizedPhrase(value: string, phrase: string): boolean {
    const normalized = ` ${normalizeAssistantText(value)} `;
    const target = ` ${normalizeAssistantText(phrase)} `;
    return normalized.includes(target);
}

export function levenshteinDistance(left: string, right: string): number {
    if (left === right) return 0;
    if (!left.length) return right.length;
    if (!right.length) return left.length;
    const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
    for (let i = 1; i <= left.length; i += 1) {
        let diagonal = previous[0];
        previous[0] = i;
        for (let j = 1; j <= right.length; j += 1) {
            const above = previous[j];
            previous[j] = Math.min(
                previous[j] + 1,
                previous[j - 1] + 1,
                diagonal + (left[i - 1] === right[j - 1] ? 0 : 1),
            );
            diagonal = above;
        }
    }
    return previous[right.length];
}

export function tokenSimilarity(left: string, right: string): number {
    if (left === right) return 1;
    const maxLength = Math.max(left.length, right.length);
    if (maxLength === 0) return 1;
    return 1 - levenshteinDistance(left, right) / maxLength;
}

function isAdjacentTransposition(left: string, right: string): boolean {
    if (left.length !== right.length || left.length < 4) return false;
    const mismatches: number[] = [];
    for (let index = 0; index < left.length; index += 1) {
        if (left[index] !== right[index]) mismatches.push(index);
        if (mismatches.length > 2) return false;
    }
    return mismatches.length === 2
        && mismatches[1] === mismatches[0] + 1
        && left[mismatches[0]] === right[mismatches[1]]
        && left[mismatches[1]] === right[mismatches[0]];
}

function comparableTokenForms(token: string): string[] {
    const forms = new Set([token]);
    if (token.length >= 6 && token.endsWith("s")) forms.add(token.slice(0, -1));
    if (token.length >= 7 && token.endsWith("es")) forms.add(token.slice(0, -2));
    return [...forms];
}

function fuzzyComparablePair(left: string, right: string): boolean {
    if (left.length < 4 || right.length < 4) return false;
    if (Math.abs(left.length - right.length) > 2) return false;
    if (left[0] !== right[0]) return false;
    if (isAdjacentTransposition(left, right)) return true;
    return tokenSimilarity(left, right) >= (Math.max(left.length, right.length) >= 8 ? 0.74 : 0.8);
}

export function isFuzzyTokenMatch(queryToken: string, candidateToken: string): boolean {
    if (queryToken === candidateToken) return true;
    for (const queryForm of comparableTokenForms(queryToken)) {
        for (const candidateForm of comparableTokenForms(candidateToken)) {
            if (fuzzyComparablePair(queryForm, candidateForm)) return true;
        }
    }
    return false;
}
