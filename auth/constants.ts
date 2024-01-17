import 'dotenv/config';

export const constants = {
  secret_jwt: process.env.SECRET_JWT || 'secret_la_la',
};
