import { Strategy } from 'passport-local';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRETE,
  HOST,
  PORT,
} from '../dotenv.config';

const LocalGeneralUser = new Strategy(function(username, password, done) {});

export default LocalGeneralUser;
