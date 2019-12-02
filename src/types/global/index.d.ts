import { IUser } from '../../interfaces';

declare global {
  namespace Express {
    interface User extends IUser {}
    interface Request {
      userPayload?: {
        _id: string;
        name: string;
        email: string;
        role: string;
        accountKind: string;
      };
    }
  }
}
