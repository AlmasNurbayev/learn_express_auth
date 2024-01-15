import { Response, Request, NextFunction } from 'express';
import { Schema } from 'zod';

export async function validateSchema(
  req: Request,
  res: Response,
  next: NextFunction,
  schema: Schema,
) {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    res.status(400).json(error);
  }
}
