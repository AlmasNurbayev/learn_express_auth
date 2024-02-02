import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { AuthController } from './modules/auth/auth.controller';
import { UserController } from './modules/user/user.controller';
import { errorHandler } from './middlewares/error.handler';
import cookieParser from 'cookie-parser';
import { Logger } from './shared/logger';
import { constants } from './constants';
import { handler404 } from './middlewares/404';
import './modules/oauth/strategies/google.strategy';
import './modules/oauth/strategies/yandex.strategy';
import { OauthController } from './modules/oauth/oauth.controller';

function bootstrap() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: constants.front_url, credentials: true }));
  app.get('/', (req, res) => {
    res.send('Hello world');
  });
  app.use('/auth', AuthController());
  app.use('/oauth', OauthController());
  app.use('/user', UserController());
  app.use(errorHandler);
  app.use(handler404);
  app.listen(8010, () => {
    Logger.info('Open cors for >>> ' + constants.front_url);
    Logger.warn('start at the port 8010 >>> ' + process.env.PORT_AUTH_SERVICE);
  });
}

bootstrap();
