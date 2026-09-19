import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { db } from "../db.js";
import { binaryStorage } from "../../shared/storage/storageService.js";
import { detectImageFormat } from "../../shared/storage/imageFormat.js";
import { buildStorageKey } from "../../shared/storage/providers/localFileStorage.provider.js";
interface BlogSeedPost {
    slug: string;
    title: string;
    excerpt: string;
    topic: string;
    authorName: string;
    seoTitle: string;
    seoDescription: string;
    coverAlt: string;
    coverFile: string;
    content: string;
}
const posts: BlogSeedPost[] = [
    {
        slug: "cada-cuanto-calibrar-un-instrumento-de-medicion",
        title: "¿Cada cuánto conviene calibrar un instrumento de medición?",
        excerpt: "La frecuencia de calibración no debería definirse por costumbre. Depende del uso, criticidad, historial y requisitos del proceso.",
        topic: "Metrología",
        authorName: "Equipo ISOCAL",
        seoTitle: "Frecuencia de calibración de instrumentos | ISOCAL",
        seoDescription: "Criterios prácticos para definir intervalos de calibración según uso, criticidad, historial y requisitos del proceso.",
        coverAlt: "Técnico revisando instrumentos de medición en un entorno industrial controlado.",
        coverFile: "blog-frecuencia-calibracion-industrial.webp",
        content: `## No existe un intervalo universal\n\nCalibrar cada seis o doce meses puede ser una referencia inicial, pero no reemplaza una evaluación del instrumento y del proceso donde se utiliza.\n\nLa frecuencia debería considerar al menos cuatro factores: **criticidad de la medición**, intensidad de uso, condiciones ambientales e historial de resultados.\n\n## Señales para acortar el intervalo\n\nConviene revisar la frecuencia cuando el equipo trabaja cerca de sus límites, recibe golpes o vibraciones, se utiliza en procesos críticos o muestra una tendencia de deriva entre calibraciones.\n\n## Cuándo puede ampliarse\n\nUn intervalo puede ampliarse de forma controlada cuando existe evidencia histórica suficiente de estabilidad y el riesgo asociado a una desviación es bajo. La decisión debe quedar documentada.\n\n## Una decisión basada en riesgo\n\nEl objetivo no es calibrar más veces, sino **calibrar cuando el proceso realmente lo necesita**. Un buen programa metrológico equilibra confiabilidad, continuidad operativa y costo.`,
    },
    {
        slug: "como-leer-un-certificado-de-calibracion",
        title: "Cómo leer un certificado de calibración sin perderse en los datos",
        excerpt: "Resultado, error, incertidumbre y trazabilidad cumplen funciones distintas. Entenderlas permite usar el certificado para tomar decisiones técnicas.",
        topic: "Calibración",
        authorName: "Equipo ISOCAL",
        seoTitle: "Cómo leer un certificado de calibración | ISOCAL",
        seoDescription: "Guía para interpretar resultados, error, incertidumbre y trazabilidad en un certificado de calibración.",
        coverAlt: "Certificado de calibración junto a un instrumento de medición sobre una mesa técnica.",
        coverFile: "blog-certificado-calibracion.webp",
        content: `## Empieza por identificar el equipo\n\nAntes de revisar números, confirma que el certificado corresponda al instrumento correcto: marca, modelo, serie y cualquier identificación interna utilizada por tu empresa.\n\n## Resultado y error no son lo mismo\n\nEl resultado indica lo observado durante la calibración. El error expresa la diferencia entre la indicación del instrumento y el valor de referencia utilizado.\n\n## La incertidumbre importa\n\nToda medición tiene un grado de incertidumbre. Ese valor ayuda a entender qué tan amplio es el rango razonable alrededor del resultado reportado.\n\n## Revisa la trazabilidad\n\nLa trazabilidad conecta el resultado con referencias reconocidas mediante una cadena documentada de calibraciones. No es una frase decorativa: es parte del sustento técnico del resultado.\n\n## El certificado no decide por tu proceso\n\nQue un instrumento tenga certificado no significa automáticamente que sea apto para cualquier uso. La aceptación final debe compararse con las tolerancias y requisitos de tu proceso.`,
    },
    {
        slug: "iso-iec-17025-que-significa-para-un-laboratorio",
        title: "ISO/IEC 17025: qué significa realmente para un laboratorio",
        excerpt: "La norma no se limita a documentos. Busca demostrar competencia técnica, consistencia operativa y resultados confiables.",
        topic: "ISO/IEC 17025",
        authorName: "Equipo ISOCAL",
        seoTitle: "ISO/IEC 17025 para laboratorios | ISOCAL",
        seoDescription: "Qué evalúa ISO/IEC 17025 y por qué la competencia técnica va más allá de tener procedimientos documentados.",
        coverAlt: "Laboratorio de calibración con equipos de referencia y estación de trabajo técnica.",
        coverFile: "blog-iso-17025-laboratorio.webp",
        content: `## Competencia antes que burocracia\n\nISO/IEC 17025 establece requisitos para que un laboratorio demuestre que trabaja de forma competente y que puede producir resultados técnicamente válidos.\n\n## Qué cubre\n\nLa norma aborda recursos, personal, equipos, trazabilidad metrológica, métodos, manejo de ítems, aseguramiento de la validez de los resultados y gestión del sistema.\n\n## Procedimientos que se pueden demostrar\n\nNo basta con escribir cómo debería hacerse una actividad. El laboratorio debe poder demostrar que aplica sus métodos, controla sus recursos y conserva evidencia coherente.\n\n## El alcance importa\n\nLa competencia se evalúa para actividades específicas. Por eso siempre conviene revisar el alcance aplicable cuando necesitas confirmar una capacidad concreta de calibración o ensayo.`,
    },
    {
        slug: "cinco-senales-de-que-un-equipo-necesita-revision-metrologica",
        title: "5 señales de que un equipo necesita una revisión metrológica",
        excerpt: "Cambios de lectura, golpes, condiciones exigentes o resultados inconsistentes pueden justificar una revisión antes de la fecha programada.",
        topic: "Mantenimiento",
        authorName: "Equipo ISOCAL",
        seoTitle: "Señales para revisar un instrumento de medición | ISOCAL",
        seoDescription: "Cinco situaciones que justifican revisar un instrumento antes de su próxima calibración programada.",
        coverAlt: "Instrumentos portátiles de medición preparados para inspección y mantenimiento técnico.",
        coverFile: "blog-revision-instrumentos-industriales.webp",
        content: `## 1. La lectura dejó de ser consistente\n\nSi un equipo entrega valores inestables bajo condiciones similares, conviene investigar antes de seguir utilizándolo en decisiones críticas.\n\n## 2. Recibió un golpe o una caída\n\nUn impacto puede alterar componentes internos aunque el equipo siga encendiendo y parezca funcionar con normalidad.\n\n## 3. Trabajó fuera de sus condiciones habituales\n\nTemperatura, humedad, vibración, polvo o sobrecarga pueden afectar el comportamiento de un instrumento.\n\n## 4. No coincide con otros equipos de referencia\n\nUna diferencia repetitiva frente a un instrumento confiable merece revisión. La comparación informal no sustituye una calibración, pero sí puede revelar una señal de alerta.\n\n## 5. El proceso cambió\n\nUn instrumento que era suficiente para una tarea puede dejar de serlo si el proceso ahora exige otra tolerancia, rango o resolución.\n\nAnte una de estas señales, la mejor decisión es revisar el contexto técnico antes de esperar automáticamente a la siguiente fecha del calendario.`,
    },
];
function coverPath(filename: string): string {
    return join(__dirname, "assets", "blog", filename);
}
async function attachCover(postId: number, post: BlogSeedPost): Promise<void> {
    const path = coverPath(post.coverFile);
    try {
        await access(path);
    }
    catch {
        console.warn(`Blog seed: falta ${post.coverFile}; el artículo se creó sin portada.`);
        return;
    }
    const existing = await db.query<{
        cover_key: string | null;
    }>("SELECT cover_key FROM blog_posts WHERE id = $1", [postId]);
    const currentKey = existing.rows[0]?.cover_key ?? null;
    if (currentKey) {
        try {
            await binaryStorage.read(currentKey);
            return;
        } catch {
            await db.query(
                `UPDATE blog_posts
                 SET cover_key = NULL, cover_mime = NULL, cover_hash = NULL, updated_at = CURRENT_TIMESTAMP
                 WHERE id = $1`,
                [postId],
            );
        }
    }
    const content = await readFile(path);
    const format = detectImageFormat(content);
    if (!format) {
        throw new Error(`Formato de imagen no válido para ${post.coverFile}.`);
    }
    const key = buildStorageKey({
        resourceType: "blog",
        resourceId: postId,
        assetRole: "cover",
        extension: format.extension,
    });
    const stored = await binaryStorage.save({ key, content });
    await db.query(`
            UPDATE blog_posts
            SET cover_key = $2,
                cover_mime = $3,
                cover_hash = $4,
                cover_alt = $5,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
        `, [postId, stored.key, format.mimeType, stored.sha256, post.coverAlt]);
}
export async function seedBlog(): Promise<void> {
    for (const post of posts) {
        const result = await db.query(`
            INSERT INTO blog_posts (
                slug,
                title,
                excerpt,
                content,
                topic,
                author_name,
                status,
                seo_title,
                seo_description,
                cover_alt,
                published_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, 'published', $7, $8, $9, CURRENT_TIMESTAMP)
            ON DUPLICATE KEY UPDATE
                id = LAST_INSERT_ID(id),
                title = VALUES(title),
                excerpt = VALUES(excerpt),
                content = VALUES(content),
                topic = VALUES(topic),
                author_name = VALUES(author_name),
                seo_title = VALUES(seo_title),
                seo_description = VALUES(seo_description),
                cover_alt = CASE
                    WHEN cover_key IS NULL THEN VALUES(cover_alt)
                    ELSE cover_alt
                END,
                published_at = COALESCE(published_at, CURRENT_TIMESTAMP),
                updated_at = CURRENT_TIMESTAMP
        `, [
            post.slug,
            post.title,
            post.excerpt,
            post.content,
            post.topic,
            post.authorName,
            post.seoTitle,
            post.seoDescription,
            post.coverAlt,
        ]);
        await attachCover(result.insertId, post);
    }
    console.log(`Blog listo: ${posts.length} artículos publicados.`);
}
