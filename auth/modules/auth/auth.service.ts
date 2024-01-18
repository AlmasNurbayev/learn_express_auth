import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../../db/db';
import { users, confirms } from '../../db/schema';
import { MailerService } from '../notification/mailer.service';
import { and, eq, isNotNull } from 'drizzle-orm';
import { LoginTypeEnum } from '../../shared/login_type.enum';
import { SmscService } from '../notification/smsc.service';
import jwt from 'jsonwebtoken';
import { constants } from '../../constants';

export class AuthService {
  private mailerService = new MailerService();
  private smscService = new SmscService();

  public async register(req: Request, res: Response) {
    const { name, email, phone, password } = req.body;
    if (!phone && !email) {
      res.status(400).send({ error: 'not found email or phone' });
    }

    if (email) {
      const is_duplicate = await db.query.confirms.findFirst({
        where: and(eq(confirms.address, email), eq(confirms.type, LoginTypeEnum.email)),
      });
      if (is_duplicate) {
        res.status(400).send({ error: `duplicate ${email}` });
        return;
      }
      const confirm = await db.query.confirms.findFirst({
        where: and(
          eq(confirms.address, email),
          eq(confirms.type, LoginTypeEnum.email),
          isNotNull(confirms.confirmed_at),
        ),
      });
      if (!confirm) {
        res.status(400).send({ error: `not confirmed ${email}` });
        return;
      }
    }
    if (!email && phone) {
      const is_duplicate = await db.query.confirms.findFirst({
        where: and(eq(confirms.address, phone), eq(confirms.type, LoginTypeEnum.phone)),
      });
      if (is_duplicate) {
        res.status(400).send({ error: `duplicate ${phone}` });
        return;
      }
      const confirm = await db.query.confirms.findFirst({
        where: and(
          eq(confirms.address, phone),
          eq(confirms.type, LoginTypeEnum.phone),
          isNotNull(confirms.confirmed_at),
        ),
      });
      if (!confirm) {
        res.status(400).send({ error: `not confirmed ${phone}` });
        return;
      }
    }

    const hash = await bcrypt.hash(password, 10);
    try {
      const [user] = await db
        .insert(users)
        .values({
          name,
          email,
          phone,
          password: hash,
        })
        .returning();
      const { password: _password, ...resultWithoutPassword } = user;
      res.status(200).send({ message: 'success', user: resultWithoutPassword });
      return;
    } catch (error) {
      res.status(500).send({ error: error });
      return;
    }
  }

  async handleSendConfirm(req: Request, res: Response) {
    const { address, type } = req.query;
    const result = await this.sendNewConfirm(String(address), type as LoginTypeEnum);
    if (result.error) {
      res.status(400).send(result);
      return;
    }
    if (result.transport) {
      res.status(200).send(result);
      return;
    }
  }

  async sendNewConfirm(address: string, type: LoginTypeEnum) {
    let confirm = await db.query.confirms.findFirst({
      where: and(eq(confirms.address, address), eq(confirms.type, type)),
    });
    const confirm_code = Math.floor(Math.random() * 89999 + 10000);
    if (!confirm) {
      // создаем запись
      [confirm] = await db
        .insert(confirms)
        .values({
          address,
          type,
          confirm_code,
          requested_at: new Date(),
        })
        .returning();
    } else {
      if (confirm.requested_at && Date.now() < confirm.requested_at.getTime() + 60000) {
        // в течение 60 секунд нельзя генерировать новый код
        return { error: 'Query is temporary unavailable, try after 1 minute' };
      }
      // обновляем запись
      await db
        .update(confirms)
        .set({ confirm_code, requested_at: new Date() })
        .where(eq(confirms.id, confirm.id));
    }

    const transport = [];
    if (type === LoginTypeEnum.email) {
      const emailResult = await this.mailerService.sendMail({
        from: 'info@cipo.kz',
        to: address,
        subject: 'Код подтверждения email',
        text: `Код для подтверждения почты: ${confirm_code}`,
        html: `Код для подтверждения почты: <b>${confirm_code}</b>`,
      });
      if (emailResult.data) {
        transport.push({ email: 'success' });
      } else if (emailResult.error) {
        transport.push({ email: 'error' });
      }
    }
    if (type === LoginTypeEnum.phone) {
      const smsResult = await this.smscService.sendSms(
        address,
        `Код подтверждения: ${confirm_code}`,
      );
      if (smsResult.data) {
        transport.push({ phone: 'success' });
      } else if (smsResult.error) {
        transport.push({ phone: 'error' });
      }
    }

    return { transport };
  }

  async confirm(req: Request, res: Response) {
    const { code, address, type } = req.query;
    if (!code || !address || !type) {
      res.status(400).send({ error: 'not found all data' });
      return;
    }
    const result = await db
      .update(confirms)
      .set({ confirmed_at: new Date() })
      .where(
        and(
          eq(confirms.address, String(address)),
          eq(confirms.confirm_code, Number(code)),
          eq(confirms.type, String(type)),
        ),
      )
      .returning();
    if (result.length === 0) {
      res.status(400).send({ error: 'not correct data' });
    } else {
      res.status(200).send({ message: 'success' });
    }
  }

  async login(req: Request, res: Response) {
    const { email, phone, password } = req.body;
    if (!email && !phone) {
      res.status(400).send({ error: 'not found credentials' });
    }
    let user;
    if (email) {
      user = await db.query.users.findFirst({ where: eq(users.email, email) });
    }
    if (phone) {
      user = await db.query.users.findFirst({ where: eq(users.phone, phone) });
    }
    if (!user) {
      res.status(400).send({ error: 'not correct login data' });
    }

    const isValidPassword = await bcrypt.compare(password, String(user?.password));

    if (isValidPassword) {
      const { password: _password, ...userWithoutPassword } = user;
      const accessToken = jwt.sign(
        { id: user?.id, email: user?.email, phone: user?.phone },
        constants.secret_jwt,
        { expiresIn: '1h' },
      );
      const refreshToken = jwt.sign(
        { id: user?.id, email: user?.email, phone: user?.phone },
        constants.secret_jwt,
        { expiresIn: '30d' },
      );
      res.cookie('token', refreshToken, { httpOnly: true });
      res.status(200).send({ data: userWithoutPassword, accessToken, refreshToken });
    } else {
      res.status(400).send({ error: 'not correct login data' });
    }
  }
}
