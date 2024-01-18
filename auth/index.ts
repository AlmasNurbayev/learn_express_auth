import express from 'express';
import 'dotenv/config';
import { AuthController } from './modules/auth/auth.controller';
import { UserController } from './modules/user/user.controller';
import { errorHandler } from './middlewares/error.handler';
import cookieParser from 'cookie-parser';
import { Logger } from './shared/logger';

function bootstrap() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  app.get('/', (req, res) => {
    res.send('Hello world');
  });
  app.use('/auth', AuthController());
  app.use('/user', UserController());
  app.use(errorHandler);
  app.listen(8010, () => {
    Logger.info(
      'Serve is up and running at the port 8080 >>> ' + process.env.PORT_AUTH_SERVICE,
    );
  });
}

bootstrap();
