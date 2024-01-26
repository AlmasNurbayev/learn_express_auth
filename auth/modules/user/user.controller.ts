import { NextFunction, Response, Request, Router } from 'express';
import { UserFindSchema } from './schemas/user.find.schema';
import { validateSchema } from '../../middlewares/validateSchema';
import { UserService } from './user.service';
import { UserGetSchema } from './schemas/user.get.schema';
import { authorizeJWT } from '../../middlewares/authorizeJWT';

export function UserController() {
  const router = Router();
  const userService = new UserService();
  //router.use(startTiming);

  router.get('/me', authorizeJWT, (req: Request, res: Response, next: NextFunction) => {
    userService.getMe(req, res).catch(next);
  });

  router.get(
    '/',
    (req: Request, res: Response, next: NextFunction) => {
      validateSchema(req, res, next, UserFindSchema);
    },
    authorizeJWT,
    (req: Request, res: Response, next: NextFunction) => {
      userService.find(req, res).catch(next);
    },
  );

  router.get(
    '/:id',
    (req: Request, res: Response, next: NextFunction) => {
      validateSchema(req, res, next, UserGetSchema);
    },
    authorizeJWT,
    (req: Request, res: Response, next: NextFunction) => {
      userService.get(req, res).catch(next);
    },
  );


  return router;
}
