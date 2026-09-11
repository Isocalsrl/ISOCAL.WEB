export interface StoreBinaryInput {
    key: string;
    content: Buffer;
}

export interface StoredBinaryObject {
    key: string;
    sizeBytes: number;
    sha256: string;
}

export interface BinaryStorage {
    save(input: StoreBinaryInput): Promise<StoredBinaryObject>;
    read(key: string): Promise<Buffer>;
    delete(key: string): Promise<void>;
}

export interface StorageKeyInput {
    resourceType: string;
    resourceId: number;
    assetRole: string;
    extension: string;
}
