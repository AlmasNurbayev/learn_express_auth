import { Response, Request, Router, NextFunction } from 'express';
import { SignupController } from '../modules/auth/signup.controller';
import { AuthSignupSchema } from '../schemas/auth.signup.schema';
import { validateSchema } from '../middlewares/validateSchema';

export function AuthRoutes() {
  const router = Router();
  //router.use(startTiming);
  router.post(
    '/signup',
    (req: Request, res: Response, next: NextFunction) => {
      validateSchema(req, res, next, AuthSignupSchema);
    },
    SignupController,
  );

  return router;
}
