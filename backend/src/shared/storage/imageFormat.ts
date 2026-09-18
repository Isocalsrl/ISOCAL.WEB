export interface ImageFormat {
    mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
    extension: 'jpg' | 'png' | 'webp';
}
export function detectImageFormat(buffer: Buffer): ImageFormat | null {
    const startsWith = (bytes: readonly number[]) => buffer.length >= bytes.length && bytes.every((byte, index) => buffer[index] === byte);
    if (startsWith([0xff, 0xd8, 0xff]))
        return { mimeType: 'image/jpeg', extension: 'jpg' };
    if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
        return { mimeType: 'image/png', extension: 'png' };
    if (buffer.length >= 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') {
        return { mimeType: 'image/webp', extension: 'webp' };
    }
    return null;
}
