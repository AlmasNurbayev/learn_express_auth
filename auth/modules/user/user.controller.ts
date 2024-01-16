import { NextFunction, Response, Request, Router } from 'express';
import { UserFindSchema } from './schemas/user.find.schema';
import { validateSchema } from '../../middlewares/validateSchema';
import { UserFindService, UserGetService, UserService } from './user.service';
import { UserGetSchema } from './schemas/user.get.schema';

export function UserController() {
  const router = Router();
  const userService = new UserService();
  //router.use(startTiming);
  router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      await validateSchema(req, res, next, UserFindSchema);
    },
    (req: Request, res: Response) => {
      userService.find(req, res);
    },
  );
  router.get(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      await validateSchema(req, res, next, UserGetSchema);
    },
    (req: Request, res: Response) => {
      userService.get(req, res);
    },
  );

  return router;
}
