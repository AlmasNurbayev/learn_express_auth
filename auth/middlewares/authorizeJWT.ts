import { Response, Request, NextFunction } from 'express';
import passport from 'passport';
import '../modules/auth/strategies/jwt.strategy';
import { users } from '../db/schema';
import { Logger } from '../shared/logger';

export async function authorizeJWT(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('jwt', function (err: string, user: typeof users) {
    //console.log(err, user, jwtToken);
    if (err) {
      Logger.warning(err);
      return res.status(401).json({ error: 'unauthorized' });
    }
    if (!user) {
      return res.status(401).json({ error: 'unauthorized' });
    } else {
      req.user = { id: user.id, name: user.name, email: user.email, phone: user.phone };
    }
    return next();
  })(req, res, next);
}
