import { Response, Request, NextFunction } from 'express';

export function handler404(req: Request, res: Response, next: NextFunction) {
  res.status(404).send({ message: 'Not found' });
}
