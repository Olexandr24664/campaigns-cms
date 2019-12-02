import {
  Strategy,
  VerifyFunctionWithRequestAndParams,
  VerifyFunctionWithRequest,
} from 'passport-google-oauth2';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRETE,
  HOST,
  PORT,
} from '../dotenv.config';
import { IUser } from '../interfaces';

const accessType = 'offline';
const callbackSignupURL = `http://${HOST}:${PORT}/auth/signup/google/callback`;
const callbacLoginkURL = `http://${HOST}:${PORT}/auth/login/google/callback`;
const googleScope = ['openid', 'email', 'profile'];
// Fix missing options from constructor
// wasn't working in
// "passport": "^0.4.0",
// "passport-google-oauth2": "^0.2.0",
class MyGoogleAuth extends Strategy {
  authorizationParams(options: any) {
    var params: any = {};

    params['access_type'] = accessType;

    return params;
  }
}

const verify:
  | VerifyFunctionWithRequest
  | VerifyFunctionWithRequestAndParams = function(
  req,
  accessToken,
  refreshToken,
  params,
  profile,
  done
) {
  const user: IUser = {
    name: profile.displayName,
    email: profile.email,
    role: 'regular',
    accounts: [
      {
        kind: 'google',
        uid: profile.id,
        email: profile.email,
        userName: profile.displayName,
      },
    ],
  };
  return done(null, user);
};

const GoogleAuth2StrategySignup = new Strategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRETE,
    callbackURL: callbackSignupURL,
    scope: googleScope,
    passReqToCallback: true,
  },
  verify
);
GoogleAuth2StrategySignup.name = 'signupgoogle';

const GoogleAuth2StrategyLogin = new Strategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRETE,
    callbackURL: callbacLoginkURL,
    scope: googleScope,
    passReqToCallback: true,
  },
  verify
);

GoogleAuth2StrategyLogin.name = 'logingoogle';
export { GoogleAuth2StrategySignup, GoogleAuth2StrategyLogin };
export default GoogleAuth2StrategySignup;
