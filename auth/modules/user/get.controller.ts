import { Response, Request } from 'express';
import { db } from '../../db/db';
import { eq, ilike } from 'drizzle-orm';
import { users } from '../../db/schema';
import { AddPagination } from '../../db/get.query';
import z from 'zod/lib';
import { UserGetSchema } from '../../schemas/user.get.schema';

export async function UserGetController(req: Request, res: Response) {
  console.log('UserGetController');
  const { limit, offset, order, ...where } = req.query;
  // base query
  let qb = db.select().from(users).$dynamic();
  try {
    if (where.name) qb.where(ilike(users.name, String(where.name)));
    if (where.id) qb.where(eq(users.id, Number(where.id)));

    // typical parameters add & run it
    qb = await AddPagination(limit, offset, order, users, qb);

    res.status(200).send({ message: qb });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
}
