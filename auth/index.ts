import express from 'express';
import 'dotenv/config';
import { AuthController } from './modules/auth/auth.controller';
import { UserController } from './modules/user/user.controller';

function bootstrap() {
  const app = express();
  app.use(express.json());
  app.get('/', (req, res) => {
    res.send('Hello world');
  });
  app.use('/auth', AuthController());
  app.use('/user', UserController());
  app.listen(8010, () => {
    console.log('============================');
    console.log(new Date());
    console.log(
      'Serve is up and running at the port 8080 >>> ' + process.env.PORT_AUTH_SERVICE,
    );
  });
}

bootstrap();
