import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationHeader = req.headers['x-correlation-id'];
    const correlationId = Array.isArray(correlationHeader)
      ? correlationHeader[0]
      : correlationHeader || uuidv4();

    req.headers['x-correlation-id'] = correlationId;
    res.setHeader('x-correlation-id', correlationId as string);

    next();
  }
}
