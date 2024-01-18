import { NextFunction, Request, Response } from 'express';
import { Logger } from '../shared/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(err);
  }
  Logger.error(err);
  res.status(500).send({ message: 'Internal error' });
}
