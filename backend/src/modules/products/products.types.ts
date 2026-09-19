export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    categoryId: number | null;
    imageUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface UploadedProductImage {
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}
export interface ProductImageAsset {
    storageKey: string;
    fileName: string;
    mimeType: string;
    fileSizeBytes: number;
    sha256: string;
    version: number;
}
export interface CreateProductInput {
    name: string;
    slug: string;
    description?: string | null;
    categoryId?: number | null;
    isActive?: boolean;
}
export interface UpdateProductInput {
    name?: string;
    slug?: string;
    description?: string | null;
    categoryId?: number | null;
    isActive?: boolean;
}
