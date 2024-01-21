import { Response, Request } from 'express';

export function handler404(req: Request, res: Response) {
  res.status(404).send({ message: 'Not found' });
}
