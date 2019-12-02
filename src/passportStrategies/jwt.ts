import { Strategy } from 'passport-jwt';
import { jwtSecret } from '../dotenv.config';

const JwtStrategy = new Strategy(
  {
    jwtFromRequest: req => req.cookies.authJwt,
    secretOrKey: jwtSecret,
  },
  async function(payload, done) {
    return done(null, payload);
  }
);

export default JwtStrategy;
