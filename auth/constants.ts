import 'dotenv/config';

export const constants = {
  secret_jwt: process.env.SECRET_JWT || 'secret_la_la',
  front_url: process.env.FRONT_URL,
  APP_URL: process.env.APP_URL,

  GOOGLE_AUTH_CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID,
  GOOGLE_AUTH_CLIENT_SECRET: process.env.GOOGLE_AUTH_CLIENT_SECRET,
  GOOGLE_AUTH_URI: process.env.GOOGLE_AUTH_URI,
  GOOGLE_AUTH_TOKEN: process.env.GOOGLE_AUTH_TOKEN,
  GOOGLE_AUTH_PROFILE_URI: process.env.GOOGLE_AUTH_PROFILE_URI,
  GOOGLE_AUTH_CALLBACK_URI: process.env.APP_URL + '/oauth/google/callback',
};
