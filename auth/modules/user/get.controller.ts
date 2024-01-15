import { Response, Request, query } from 'express';
import { db } from '../../db/db';
import { eq, ilike } from 'drizzle-orm';
import { users } from '../../db/schema';
import { AddPagination } from '../../db/addPagination';

export async function UserGetController(req: Request, res: Response) {
  console.log('UserGetController');
  const { limit, offset, order, ...where } = req.query;

  // base query
  let query = db.select().from(users).$dynamic();
  try {
    if (where.name) query.where(ilike(users.name, String(where.name)));
    if (where.id) query.where(eq(users.id, Number(where.id)));

    // typical parameters add & run it
    // TODO - type of limit
    query = AddPagination(limit, offset, order, users, query);
    const result = await query;

    res.status(200).send({ data: result });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
}
