import { Response, Request } from 'express';
import { db } from '../../db/db';
import { eq, ilike } from 'drizzle-orm';
import { users } from '../../db/schema';
import { AddPagination } from '../../db/addPagination';
import { PgColumn, getTableConfig } from 'drizzle-orm/pg-core';

export class UserService {
  async get(req: Request, res: Response) {
    console.log('UserGetService');

    const result = await db.query.users.findFirst({
      where: eq(users.id, Number(req.params.id)),
    });
    if (!result) {
      res.status(400).send({ error: 'not found' });
    }
    res.status(200).send({ data: result });
  }
  async find(req: Request, res: Response) {
    console.log('UserFindController');
    const { limit, offset, order, ...where } = req.query;
    // filter all column except password
    const columnsOfUsers: { [key: string]: PgColumn } = {};
    getTableConfig(users).columns.forEach((el) => {
      if (el.name !== 'password') columnsOfUsers[el.name] = el;
    });
    // base query
    let query = db.select(columnsOfUsers).from(users).$dynamic();
    if (where.name) query.where(ilike(users.name, String(where.name)));
    if (where.id) query.where(eq(users.id, Number(where.id)));

    // TODO - type of limit?
    // typical parameters add & run it
    query = AddPagination(limit, offset, order, users, query);
    const result = await query;

    res.status(200).send({ data: result });
  }
}
