import type { RequestHandler } from "express";
import multer from "multer";
import { AppError } from "../../shared/errors/AppError.js";

const blogImageUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
        fields: 2,
        fieldSize: 1024,
    },
});

function withBlogUploadError(
    upload: RequestHandler,
    errorCode: string,
    errorMessage: string,
): RequestHandler {
    return (req, res, next) => {
        upload(req, res, (error) => {
            if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
                next(new AppError(413, errorMessage, errorCode));
                return;
            }
            next(error);
        });
    };
}

export const uploadBlogCover = withBlogUploadError(
    blogImageUpload.single("cover"),
    "BLOG_COVER_TOO_LARGE",
    "La portada no puede superar los 5 MB.",
);

export const uploadBlogContentImage = withBlogUploadError(
    blogImageUpload.single("image"),
    "BLOG_IMAGE_TOO_LARGE",
    "La imagen no puede superar los 5 MB.",
);
