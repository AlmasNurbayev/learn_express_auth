import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { constants } from '../../constants';
import { Logger } from '../../shared/logger';
import { generateRefreshToken } from '../../shared/jwt_helpers';
import { IUser } from '../../shared/interfaces';

export class OauthService {
  async googleAuthenticate(req: Request, res: Response, next: NextFunction) {
    // google аутентифицирует юзера на свой странице
    passport.authenticate('oauth2', {
      scope: ['profile', 'email'],
      failureRedirect: constants.front_url + '/failure',
    })(req, res, next);
  }
  async googleCallback(req: Request, res: Response, next: NextFunction) {
    // google отправляет нам свой токен юзера
    passport.authenticate(
      'oauth2',
      {
        failureRedirect: constants.front_url + '/failure',
        failureMessage: 'callback some error occured',
        successRedirect: constants.front_url + '/profile',
        session: false,
      },
      (err, user: IUser) => {
        // колбек срабатывает только в случае успешного входа OAuth
        // если успех - выдаем наш refresh token в куке и пересылаем на фронт
        // и далее фронт через interceptor сам получает access token путем запроса /auth/refresh
        if (err || !user) {
          Logger.error(err);
          res.status(401).send({ error: 'not find profile' });
        }
        const refreshToken = generateRefreshToken({
          id: Number(user?.id),
          email: user?.email || '',
          phone: user?.phone || '',
        });
        res.cookie('token_auth_sample', refreshToken, { httpOnly: true });
        res.redirect(constants.front_url + '');
      },
    )(req, res, next);
  }

  async yandexAuthenticate(req: Request, res: Response, next: NextFunction) {
    // google аутентифицирует юзера на свой странице
    passport.authenticate('yandex', {
      //scope: ['info', 'email'],
      failureRedirect: constants.front_url + '/failure',
    })(req, res, next);
  }

  async yandexCallback(req: Request, res: Response, next: NextFunction) {
    // google отправляет нам свой токен юзера
    passport.authenticate(
      'yandex',
      {
        failureRedirect: constants.front_url + '/failure',
        failureMessage: 'callback some error occured',
        successRedirect: constants.front_url + '/profile',
        session: false,
      },
      (err, user: IUser) => {
        // колбек срабатывает только в случае успешного входа OAuth
        // если успех - выдаем наш refresh token в куке и пересылаем на фронт
        // и далее фронт через interceptor сам получает access token путем запроса /auth/refresh
        if (err || !user) {
          Logger.error(err);
          res.status(401).send({ error: 'not find profile' });
        }
        const refreshToken = generateRefreshToken({
          id: Number(user?.id),
          email: user?.email || '',
          phone: user?.phone || '',
        });
        res.cookie('token_auth_sample', refreshToken, { httpOnly: true });
        res.redirect(constants.front_url + '');
      },
    )(req, res, next);
  }
}
