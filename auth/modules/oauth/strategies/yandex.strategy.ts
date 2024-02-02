import passport from 'passport';
import { constants } from '../../../constants';
import Oauth2Strategy from 'passport-oauth2';
import axios from 'axios';
import { Logger } from '../../../shared/logger';
import { createOrGetUser } from '../oauth.helpers';

passport.use(
  'yandex',
  new Oauth2Strategy(
    {
      clientID: constants.YANDEX_AUTH_CLIENT_ID || '',
      clientSecret: constants.YANDEX_AUTH_CLIENT_SECRET || '',
      callbackURL:
        constants.YANDEX_AUTH_CALLBACK_URI ||
        'http://localhost:7005/oauth/yandex/callback',
      authorizationURL: 'https://oauth.yandex.ru/authorize',
      tokenURL: 'https://oauth.yandex.ru/token',
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('accessToken', accessToken);
      console.log('refreshToken', refreshToken);
      console.log('profile', profile);

      const profileYandex = await getProfileYandex(accessToken);
      if (profile) {
        return done(null, profileYandex);
      } else {
        return done(null, null);
      }
    },
  ),
);

async function getProfileYandex(accessToken: string) {
  try {
    // получаем профиль у Google с помощью полученнего токена
    const res = await axios.get(
      constants.YANDEX_AUTH_PROFILE_URI || 'https://login.yandex.ru/info?',
      {
        headers: {
          Authorization: `Oauth ${accessToken}`,
        },
      },
    );
    if (res.status === 200) {
      // если получили профиль от Google - создаем или получаем юзера
      return await createOrGetUser(
        {
          email: res.data.default_email,
          name: res.data.real_name,
          phone: res.data.default_phone.number,
          external_id: res.data.id,
        },
        'yandex',
      );
    } else {
      return null;
    }
  } catch (error) {
    Logger.error(error);
    return null;
  }
}

//https://login.yandex.ru/info?
