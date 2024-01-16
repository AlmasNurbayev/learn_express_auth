import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../../db/db';
import { users } from '../../db/schema';
import { MailerService } from '../notification/mailer.service';
import { and, eq } from 'drizzle-orm';
import { LoginTypeEnum } from '../../shared/login_type.enum';
import { SmscService } from '../notification/smsc.service';

export class AuthService {
  mailerService = new MailerService();
  smscService = new SmscService();
  async register(req: Request, res: Response) {
    const { name, email, phone, password } = req.body;
    if (!phone && !email) {
      res.status(400).send({ error: 'not found email or phone' });
    }
    const hash = await bcrypt.hash(password, 10);

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

    if (user.email) {
      const transport = await this.sendNewConfirm(user.email, LoginTypeEnum.email);
      res.status(200).send({ data: resultWithoutPassword, confirm: transport });
    }
    if (!user.email && user.phone) {
      const transport = await this.sendNewConfirm(user.phone, LoginTypeEnum.phone);
      res.status(200).send({ data: resultWithoutPassword, confirm: transport });
    }
  }

  async handleConfirm(req: Request, res: Response) {
    const { address, type } = req.query;
    console.log(address, type);
    const result = await this.sendNewConfirm(String(address), type);
    if (result.error) {
      res.status(400).send(result);
    }
    if (result.transport) {
      res.status(200).send(result);
    }
  }

  async sendNewConfirm(address: string, type: LoginTypeEnum) {
    let user;
    if (type === LoginTypeEnum.email) {
      user = await db.query.users.findFirst({ where: eq(users.email, address) });
    }
    if (type === LoginTypeEnum.phone) {
      user = await db.query.users.findFirst({ where: eq(users.phone, address) });
    }
    if (!user) {
      return { error: 'User not found' };
    }
    if (user.confirm_date && Date.now() < user.confirm_date.getTime() + 60000) {
      // в течение 60 секунд нельзя генерировать новый код
      return { error: 'Query is temporary unavailable, try after 1 minute' };
    }

    const code = Math.floor(Math.random() * 89999 + 10000);
    const [updatedUser] = await db
      .update(users)
      .set({ confirm_code: code, confirm_date: new Date() })
      .where(eq(users.id, user.id))
      .returning();

    const transport = [];
    if (type === LoginTypeEnum.email) {
      const emailResult = await this.mailerService.sendMail({
        from: 'info@cipo.kz',
        to: address,
        subject: 'Код подтверждения email',
        text: `Код для подтверждения почты: ${updatedUser.confirm_code}`,
        html: `Код для подтверждения почты: <b>${updatedUser.confirm_code}</b>`,
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
        `Код подтверждения: ${updatedUser.confirm_code}`,
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
    }
    if (type === LoginTypeEnum.email) {
      const result = await db
        .update(users)
        .set({ is_confirmed: true })
        .where(
          and(eq(users.email, String(address)), eq(users.confirm_code, Number(code))),
        )
        .returning();
      if (result.length === 0) {
        res.status(400).send({ error: 'not correct data' });
      } else {
        res.status(200).send({ data: result });
      }
    }
    if (type === LoginTypeEnum.phone) {
      const result = await db
        .update(users)
        .set({ is_confirmed: true })
        .where(
          and(eq(users.phone, String(address)), eq(users.confirm_code, Number(code))),
        )
        .returning();
      if (result.length === 0) {
        res.status(400).send({ error: 'not correct data' });
      } else {
        res.status(200).send({ data: result });
      }
    }
  }
}
