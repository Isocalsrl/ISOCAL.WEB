import { db } from "../db.js";
import { seedAdmin } from "../../modules/auth/services/auth.seed.service.js";
import {
    createSeedCategoryIfMissing,
} from "../../modules/categories/repositories/categories.seed.repository.js";
import {
    createSeedProductIfMissing,
} from "../../modules/products/repositories/products.seed.repository.js";

const TEST_ADMIN = {
    name: "Administrador Isocal",
    email: "admin@isocal.com",
    password: "Admin123!",
    role: "super_admin" as const,
};

const TEST_CATEGORIES = [
    {
        name: "Metrología",
        slug: "metrologia",
        description:
            "Servicios de calibración y aseguramiento metrológico.",
    },
    {
        name: "Consultoría",
        slug: "consultoria",
        description:
            "Asesoría técnica para sistemas de gestión y acreditación.",
    },
    {
        name: "Auditoría",
        slug: "auditoria",
        description:
            "Evaluación independiente de procesos y sistemas de gestión.",
    },
] as const;

const TEST_PRODUCTS = [
    {
        name: "Calibración de termómetros",
        slug: "calibracion-de-termometros",
        description:
            "Calibración trazable de termómetros digitales, analógicos y patrones de temperatura.",
        categorySlug: "metrologia",
    },
    {
        name: "Calibración de balanzas",
        slug: "calibracion-de-balanzas",
        description:
            "Calibración de instrumentos de pesaje para aplicaciones industriales y de laboratorio.",
        categorySlug: "metrologia",
    },
    {
        name: "Implementación ISO/IEC 17025",
        slug: "implementacion-iso-iec-17025",
        description:
            "Acompañamiento técnico para implementar y fortalecer sistemas de gestión de laboratorios.",
        categorySlug: "consultoria",
    },
    {
        name: "Auditoría de sistemas de gestión",
        slug: "auditoria-de-sistemas-de-gestion",
        description:
            "Revisión técnica del cumplimiento y eficacia de los procesos de gestión.",
        categorySlug: "auditoria",
    },
] as const;

export async function runSeeds(): Promise<void> {
    const adminResult =
        await seedAdmin(TEST_ADMIN);

    console.log(
        adminResult === "created"
            ? "Administrador inicial creado."
            : "Seed de administrador omitido: el correo ya existe.",
    );

    const categoryIds =
        new Map<string, number>();

    for (const category of TEST_CATEGORIES) {
        categoryIds.set(
            category.slug,
            await createSeedCategoryIfMissing(
                category,
            ),
        );
    }

    let createdProducts = 0;

    for (const product of TEST_PRODUCTS) {
        const categoryId =
            categoryIds.get(
                product.categorySlug,
            );

        if (!categoryId) {
            throw new Error(
                `Categoría no encontrada para el producto ${product.slug}.`,
            );
        }

        const wasCreated =
            await createSeedProductIfMissing({
                name: product.name,
                slug: product.slug,
                description:
                    product.description,
                categoryId,
            });

        if (wasCreated) {
            createdProducts += 1;
        }
    }

    console.log(
        `Catálogo de prueba listo: ${TEST_CATEGORIES.length} categorías y ${TEST_PRODUCTS.length} productos (${createdProducts} productos creados).`,
    );
}

async function execute(): Promise<void> {
    try {
        await runSeeds();
    } finally {
        await db.end();
    }
}

if (require.main === module) {
    execute().catch((error) => {
        console.error("No se pudieron ejecutar los seeds.", error);
        process.exitCode = 1;
    });
}
