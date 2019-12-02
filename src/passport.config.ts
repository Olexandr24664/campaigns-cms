import passport from 'passport';
import {
  GoogleAuth2StrategySignup,
  GoogleAuth2StrategyLogin,
} from './passportStrategies/google';
import JwtStrategy from './passportStrategies/jwt';

passport.use(GoogleAuth2StrategySignup);
passport.use(GoogleAuth2StrategyLogin);
passport.use(JwtStrategy);
export default passport;
