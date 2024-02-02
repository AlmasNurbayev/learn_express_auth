import { Router, Request, Response, NextFunction } from 'express';
import { OauthService } from './oauth.service';

export function OauthController() {
  const router = Router();
  const oauthService = new OauthService();

  router.get('/google', (req: Request, res: Response, next: NextFunction) => {
    oauthService.googleAuthenticate(req, res, next).catch(next);
  });

  router.get('/google/callback', (req: Request, res: Response, next: NextFunction) => {
    oauthService.googleCallback(req, res, next).catch(next);
  });

  router.get('/yandex', (req: Request, res: Response, next: NextFunction) => {
    oauthService.yandexAuthenticate(req, res, next).catch(next);
  });

  router.get('/yandex/callback', (req: Request, res: Response, next: NextFunction) => {
    oauthService.yandexCallback(req, res, next).catch(next);
  });

  return router;
}
