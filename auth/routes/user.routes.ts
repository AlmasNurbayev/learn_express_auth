import { NextFunction, Response, Request, Router } from 'express';
import { UserGetSchema } from '../schemas/user.get.schema';
import { validateSchema } from '../middlewares/validateSchema';
import { UserGetController } from '../modules/user/get.controller';

export function UserRoutes() {
  const router = Router();
  //router.use(startTiming);
  router.get(
    '/',
    (req: Request, res: Response, next: NextFunction) => {
      validateSchema(req, res, next, UserGetSchema);
    },
    UserGetController,
  );

  return router;
}
