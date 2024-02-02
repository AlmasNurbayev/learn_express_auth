import Oauth2Strategy from 'passport-oauth2';
import { constants } from '../../../constants';
import passport from 'passport';
import axios from 'axios';
import { Logger } from '../../../shared/logger';
import { createOrGetUser } from '../oauth.helpers';

console.log(constants.GOOGLE_AUTH_CALLBACK_URI);

// эту стратегию нужно обязательно импортировать внутри index.ts
passport.use(
  'google',
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
      const profile = await getProfileGoogle(results.access_token);
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

async function getProfileGoogle(accessToken: string) {
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
      return await createOrGetUser(
        {
          email: res.data.email,
          name: res.data.name,
          phone: res.data.phone,
          external_id: res.data.sub,
        },
        'google',
      );
    } else {
      return null;
    }
  } catch (error) {
    Logger.error(error);
    return null;
  }
}
