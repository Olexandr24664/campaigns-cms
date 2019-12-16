import passport from 'passport';
import { Application, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { CMSSSTARTER_APP_URL } from '../dotenv.config';

const maxAgeCookieMs: number = 2073600000;

export class AuthController {
  private authService: AuthService;
  constructor(private app: Application) {
    this.authService = new AuthService();
    this.routes();
  }

  public routes() {
    this.routesGoogle();
    this.routesLocal();
    this.app.route('/auth/logout').delete(this.logout);
  }

  public routesGoogle() {
    this.app.route('/auth/signup/google').get(
      passport.authenticate('signupgoogle', {
        session: false,
      })
    );
    this.app.route('/auth/signup/google/callback').get(
      passport.authenticate('signupgoogle', {
        session: false,
      }),
      this.signupGoogle
    );
    this.app.route('/auth/login/google').get(
      passport.authenticate('logingoogle', {
        session: false,
      })
    );
    this.app.route('/auth/login/google/callback').get(
      passport.authenticate('logingoogle', {
        session: false,
      }),
      this.loginGoogle
    );
  }

  public routesLocal() {
    this.app.route('/auth/signup/local').post(this.signupLocal);
    this.app.route('/auth/login/local').post(this.loginLocal);
  }

  signupLocal = async (req: Request, res: Response) => {
    if (!req.body.email || !req.body.password) {
      return res.status(404).send('not valid credentials.');
    }
    try {
      const { payload, token } = await this.authService.signupLocal({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      res
        .cookie('authJwt', token, {
          httpOnly: true,
          maxAge: maxAgeCookieMs,
          secure: false,
        })
        .status(200)
        .send({
          name: payload.name,
          email: payload.email,
          role: payload.role,
          accountKind: payload.accountKind,
        });
    } catch (e) {
      return res.status(400).send(e.message);
    }
  };

  loginLocal = async (req: Request, res: Response) => {
    if (!req.body.email || !req.body.password) {
      return res.status(404).send('not valid credentials.');
    }
    try {
      const { payload, token } = await this.authService.loginLocal({
        name: '',
        email: req.body.email,
        password: req.body.password,
      });
      res
        .cookie('authJwt', token, {
          httpOnly: true,
          maxAge: maxAgeCookieMs,
          secure: false,
        })
        .status(200)
        .send({
          name: payload.name,
          email: payload.email,
          role: payload.role,
          accountKind: payload.accountKind,
        });
    } catch (e) {
      return res.status(400).send(e.message);
    }
  };

  signupGoogle = async (req: Request, res: Response) => {
    try {
      const { token } = await this.authService.signupGoogle(req.user);
      res
        .cookie('authJwt', token, {
          httpOnly: true,
          maxAge: maxAgeCookieMs,
          secure: false,
        })
        .redirect(CMSSSTARTER_APP_URL);
    } catch (e) {
      const url = CMSSSTARTER_APP_URL + '?error=signupGoogle&msg=' + e.message;
      return res.redirect(url);
    }
  };

  loginGoogle = async (req: Request, res: Response) => {
    try {
      const { token } = await this.authService.loginGoogle(req.user);
      res
        .cookie('authJwt', token, {
          httpOnly: true,
          maxAge: maxAgeCookieMs,
          secure: false,
        })
        .redirect(CMSSSTARTER_APP_URL);
    } catch (e) {
      const url = CMSSSTARTER_APP_URL + '?error=loginGoogle&msg=' + e.message;
      return res.redirect(url);
    }
  };

  logout = async (req: Request, res: Response) => {
    return res
      .status(204)
      .clearCookie('authJwt')
      .send();
  };
}
