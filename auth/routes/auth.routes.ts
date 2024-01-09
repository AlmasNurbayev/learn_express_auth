import { Router } from 'express';
import { SignupController } from '../controllers/auth/signup';

export function AuthRoutes() {
  const router = Router();
  //router.use(startTiming);
  router.get('/signup', SignupController);

  return router;
}
