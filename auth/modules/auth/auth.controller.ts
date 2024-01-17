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
    async (req: Request, res: Response, next: NextFunction) => {
      await validateSchema(req, res, next, AuthRegisterSchema);
    },
    (req: Request, res: Response) => {
      authService.register(req, res);
    },
  );

  router.post(
    '/login',
    async (req: Request, res: Response, next: NextFunction) => {
      await validateSchema(req, res, next, AuthLoginSchema);
    },
    (req: Request, res: Response) => {
      authService.login(req, res);
    },
  );

  router.get(
    '/send_confirm',
    async (req: Request, res: Response, next: NextFunction) => {
      await validateSchema(req, res, next, AuthSendConfirmSchema);
    },
    (req: Request, res: Response) => {
      const {} = req.body;
      authService.handleSendConfirm(req, res);
    },
  );

  router.get(
    '/confirm',
    async (req: Request, res: Response, next: NextFunction) => {
      await validateSchema(req, res, next, AuthConfirmSchema);
    },
    (req: Request, res: Response) => {
      authService.confirm(req, res);
    },
  );

  return router;
}
