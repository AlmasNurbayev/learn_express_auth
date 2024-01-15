import { NextFunction, Response, Request, Router } from 'express';
import { UserFindSchema, UserGetSchema } from '../schemas/user.get.schema';
import { validateSchema } from '../middlewares/validateSchema';
import { UserFindController, UserGetController } from '../modules/user/find.controller';

export function UserRoutes() {
  const router = Router();
  //router.use(startTiming);
  router.get(
    '/',
    (req: Request, res: Response, next: NextFunction) => {
      validateSchema(req, res, next, UserFindSchema);
    },
    UserFindController,
  );
  router.get(
    '/:id',
    (req: Request, res: Response, next: NextFunction) => {
      validateSchema(req, res, next, UserGetSchema);
    },
    UserGetController,
  );

  return router;
}
