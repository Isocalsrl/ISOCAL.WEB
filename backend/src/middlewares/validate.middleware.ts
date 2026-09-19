import type { NextFunction, Request, RequestHandler, Response } from "express";
export type Validator = (value: unknown) => void;
export function validateBody(validator: Validator): RequestHandler {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            validator(req.body);
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
