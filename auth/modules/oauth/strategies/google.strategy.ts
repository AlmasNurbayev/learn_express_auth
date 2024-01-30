import Oauth2Strategy from 'passport-oauth2';
import { constants } from '../../../constants';
import passport from 'passport';
import axios from 'axios';
import { Logger } from '../../../shared/logger';
import { db } from '../../../db/db';
import { oauth_users, users } from '../../../db/schema';
import { eq, or } from 'drizzle-orm';
import { IUser } from '../../../shared/interfaces';

console.log(constants.GOOGLE_AUTH_CALLBACK_URI);

// эту стратегию нужно обязательно импортировать внутри index.ts
passport.use(
  new Oauth2Strategy(
    {
      authorizationURL:
        constants.GOOGLE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
      tokenURL: constants.GOOGLE_AUTH_TOKEN || '',
      clientID: constants.GOOGLE_AUTH_CLIENT_ID || '',
      clientSecret: constants.GOOGLE_AUTH_CLIENT_SECRET || '',
      callbackURL: constants.GOOGLE_AUTH_CALLBACK_URI,
    },
    // если Google пропустил и выдал токены
    async (accessToken, refreshToken, results, profileFromGoogle, done) => {
      // получаем профиль Google, ищем по почте нашего юзера или создаем его
      const profile = await getProfile(results.access_token);
      if (!profile) {
        // если не нашли и не создали - прокидываем дальше ошибку и пустой профиль
        return done(new Error('not created profile'), undefined);
      } else {
        // если получили или создали - прокидываем дальше профиль
        return done(null, profile);
      }
    },
  ),
);

async function getProfile(accessToken: string) {
  try {
    // получаем профиль у Google с помощью полученнего токена
    const res = await axios.get(
      constants.GOOGLE_AUTH_PROFILE_URI ||
        'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (res.status === 200) {
      // если получили профиль от Google - создаем или получаем юзера
      return await createOrGetUser({
        email: res.data.email,
        name: res.data.name,
        phone: res.data.phone,
        external_id: res.data.sub,
      });
    } else {
      return null;
    }
  } catch (error) {
    Logger.error(error);
    return null;
  }
}

async function createOrGetUser(profile: IUser) {
  const { name, email, phone, external_id } = profile;
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
          provider: 'google',
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
