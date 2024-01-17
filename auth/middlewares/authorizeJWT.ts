import { Response, Request, NextFunction } from 'express';
import passport from 'passport';
import '../modules/auth/jwt/jwt.strategy';
import { users } from '../db/schema';

export async function authorizeJWT(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('jwt', function (err: string, user: typeof users, jwtToken) {
    //console.log(err, user, jwtToken);
    if (err) {
      console.error(err);
      return res.status(401).json({ error: 'unauthorized' });
    }
    if (!user) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    return next();
  })(req, res, next);
}
