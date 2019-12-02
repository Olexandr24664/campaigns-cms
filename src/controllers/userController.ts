import passport from 'passport';
import { Application, Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  private userService: UserService;

  constructor(private app: Application) {
    this.userService = new UserService();
    this.routes();
  }

  public routes() {
    this.app.route('/user/payload').get(
      passport.authenticate('jwt', {
        session: false,
        assignProperty: 'userPayload',
      }),
      this.getPayload
    );
  }

  getPayload = async (req: Request, res: Response) => {
    if (!req.userPayload) {
      return res.sendStatus(403);
    }
    const { name, accountKind, email, role } = req.userPayload;
    return res.status(200).send({
      name,
      accountKind,
      email,
      role,
    });
  };
}
