import { Response, Request, Router, NextFunction } from 'express';
import { validateSchema } from '../../middlewares/validateSchema';
import { AuthRegisterSchema } from './schemas/auth.register.schema';
import { AuthService } from './auth.service';
import { AuthConfirmSchema } from './schemas/auth.confirm.schema';
import { AuthSendConfirmSchema } from './schemas/auth.sendConfirm.schema';
import { AuthLoginSchema } from './schemas/auth.login.schema';

export function AuthController() {
  const router = Router();
  const authService = new AuthService();
  //router.use(startTiming);
  router.post(
    '/register',
    (req: Request, res: Response, next: NextFunction) => {
      validateSchema(req, res, next, AuthRegisterSchema);
    },
    (req: Request, res: Response, next: NextFunction) => {
      authService.register(req, res).catch(next);
    },
  );

  router.post(
    '/login',
    (req: Request, res: Response, next: NextFunction) => {
      validateSchema(req, res, next, AuthLoginSchema);
    },
    (req: Request, res: Response, next: NextFunction) => {
      authService.login(req, res).catch(next);
    },
  );

  router.get(
    '/send_confirm',
    (req: Request, res: Response, next: NextFunction) => {
      validateSchema(req, res, next, AuthSendConfirmSchema);
    },
    (req: Request, res: Response, next: NextFunction) => {
      const {} = req.body;
      authService.handleSendConfirm(req, res).catch(next);
    },
  );

  router.get(
    '/confirm',
    (req: Request, res: Response, next: NextFunction) => {
      validateSchema(req, res, next, AuthConfirmSchema);
    },
    (req: Request, res: Response, next: NextFunction) => {
      authService.confirm(req, res).catch(next);
    },
  );

  return router;
}
