import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../../db/db';
import { users } from '../../db/schema';

export async function SignupController(req: Request, res: Response) {
  const { name, email, phone, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const [result] = await db
      .insert(users)
      .values({ name, email, phone, password: hash })
      .returning();
    const { password, ...resultWithoutPassword } = result;

    res.status(200).send({ message: resultWithoutPassword });
  } catch (error) {
    res.status(400).send({ error: error });
  }
}
