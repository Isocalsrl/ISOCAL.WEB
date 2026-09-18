import { createHash, randomUUID } from "node:crypto";
import { access, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, resolve, sep } from "node:path";
import type { BinaryStorage, StorageKeyInput, StoreBinaryInput, StoredBinaryObject } from "../storage.types.js";
export class LocalFileStorageProvider implements BinaryStorage {
    private readonly root: string;
    constructor(root: string) {
        this.root = resolve(root);
    }
    private resolveKey(key: string): string {
        const normalized = key.replace(/\\/g, "/");
        if (!normalized || isAbsolute(normalized) || normalized.split("/").includes("..")) {
            throw new Error("Storage key inválida.");
        }
        const absolutePath = resolve(this.root, normalized);
        if (absolutePath !== this.root && !absolutePath.startsWith(`${this.root}${sep}`)) {
            throw new Error("La ruta solicitada se encuentra fuera del almacenamiento permitido.");
        }
        return absolutePath;
    }
    async save(input: StoreBinaryInput): Promise<StoredBinaryObject> {
        const absolutePath = this.resolveKey(input.key);
        await mkdir(dirname(absolutePath), { recursive: true });
        await writeFile(absolutePath, input.content, { flag: "wx" });
        return {
            key: input.key,
            sizeBytes: input.content.byteLength,
            sha256: createHash("sha256").update(input.content).digest("hex"),
        };
    }
    async read(key: string): Promise<Buffer> {
        return readFile(this.resolveKey(key));
    }
    async exists(key: string): Promise<boolean> {
        try {
            await access(this.resolveKey(key));
            return true;
        }
        catch (error: unknown) {
            if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") return false;
            throw error;
        }
    }
    async delete(key: string): Promise<void> {
        try {
            await unlink(this.resolveKey(key));
        }
        catch (error: unknown) {
            if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT")
                return;
            throw error;
        }
    }
}
export function buildStorageKey(input: StorageKeyInput): string {
    const resourceType = input.resourceType.trim().toLowerCase();
    const assetRole = input.assetRole.trim().toLowerCase();
    const extension = input.extension.replace(/^\./, "").trim().toLowerCase();
    if (!/^[a-z0-9_-]+$/.test(resourceType) || !/^[a-z0-9_-]+$/.test(assetRole) || !/^[a-z0-9]+$/.test(extension) || !Number.isInteger(input.resourceId) || input.resourceId <= 0) {
        throw new Error("Datos inválidos para construir la clave de almacenamiento.");
    }
    return `${resourceType}/${input.resourceId}/${assetRole}/${randomUUID()}.${extension}`;
}
