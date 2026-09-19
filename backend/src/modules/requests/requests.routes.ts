import { Router } from 'express';
import { createRateLimitMiddleware } from '../../middlewares/rate-limit.middleware.js';
import { submitRequest } from './requests.controller.js';
export const requestsRouter = Router();
requestsRouter.post('/', createRateLimitMiddleware({ windowMs: 900000, maxRequests: 10 }), submitRequest);
