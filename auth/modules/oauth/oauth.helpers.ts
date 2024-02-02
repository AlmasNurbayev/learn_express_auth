import { or, eq } from 'drizzle-orm';
import { db } from '../../db/db';
import { users, oauth_users } from '../../db/schema';
import { IUser } from '../../shared/interfaces';
import { Logger } from '../../shared/logger';

export async function createOrGetUser(profile: IUser, providerName: string) {
  const { name, email, external_id } = profile;
  let { phone } = profile;
  if (phone) {
    phone = phone.replace(/[^0-9]/g, '');
  }
  try {
    // ищем такого пользователя у нас по почте/телефону
    let user = await db.query.users.findFirst({
      where: or(eq(users.email, String(email)), eq(users.phone, String(phone))),
    });
    if (!name || (!email && !phone)) {
      return null;
    }
    if (!user) {
      // если не нашли - создаем
      [user] = await db
        .insert(users)
        .values({
          name,
          email,
          phone,
        })
        .returning();
      console.log('user before oauth', user);

      if (user) {
        // если создали - добавляем в таблицу oauth_users
        await db.insert(oauth_users).values({
          user_id: user.id,
          provider: providerName,
          external_id: external_id ? String(external_id) : null,
        });
      }
    }
    return user;
  } catch (error) {
    Logger.error(error);
    return null;
  }
}
