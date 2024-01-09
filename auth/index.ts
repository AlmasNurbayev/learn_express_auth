import express from 'express';
import 'dotenv/config';
import { AuthRoutes } from './routes/auth.routes';

function bootstrap() {
  const app = express();
  app.use(express.json());
  app.get('/', (req, res) => {
    res.send('Hello world');
  });
  app.use('/auth', AuthRoutes());
  app.listen(8010, () => {
    console.log('============================');
    console.log(new Date());
    console.log(
      'Serve is up and running at the port 8080 >>> ' + process.env.PORT_AUTH_SERVICE,
    );
  });
}

bootstrap();
