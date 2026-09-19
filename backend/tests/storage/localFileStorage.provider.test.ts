import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildStorageKey, LocalFileStorageProvider } from "../../src/shared/storage/providers/localFileStorage.provider.js";
const temporaryDirectories: string[] = [];
afterEach(async () => {
    await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});
describe("LocalFileStorageProvider", () => {
    it("guarda, lee y calcula metadata del contenido", async () => {
        const root = await mkdtemp(join(tmpdir(), "isocal-storage-"));
        temporaryDirectories.push(root);
        const storage = new LocalFileStorageProvider(root);
        const content = Buffer.from("contenido de prueba");
        const stored = await storage.save({ key: "quotes/12/document/test.pdf", content });
        expect(stored.sizeBytes).toBe(content.byteLength);
        expect(stored.sha256).toMatch(/^[a-f0-9]{64}$/);
        await expect(storage.read(stored.key)).resolves.toEqual(content);
    });
    it("rechaza claves que intentan salir de la raíz", async () => {
        const root = await mkdtemp(join(tmpdir(), "isocal-storage-"));
        temporaryDirectories.push(root);
        const storage = new LocalFileStorageProvider(root);
        await expect(storage.read("../../outside.pdf")).rejects.toThrow("Storage key inválida");
    });
    it("construye claves genéricas para cualquier recurso", () => {
        expect(buildStorageKey({ resourceType: "products", resourceId: 7, assetRole: "gallery", extension: "webp" })).toMatch(/^products\/7\/gallery\/[a-f0-9-]+\.webp$/);
        expect(buildStorageKey({ resourceType: "quotes", resourceId: 12, assetRole: "document", extension: ".pdf" })).toMatch(/^quotes\/12\/document\/[a-f0-9-]+\.pdf$/);
    });
});
