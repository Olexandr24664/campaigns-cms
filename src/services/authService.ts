import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { jwtSecret } from '../dotenv.config';
import { IUser, IUserAccount } from '../interfaces';
import UserModel, { IUserModel } from '../models/user';

interface UserDTO {
  name?: string;
  email: string;
  password: string;
}

// authentication will take approximately 13 seconds
// https://pthree.org/wp-content/uploads/2016/06/bcrypt.png
const saltRounds = 10;
export class AuthService {
  public async signupLocal(userDTO: UserDTO) {
    try {
      const existedUser = await UserModel.findOne({
        $or: [
          { email: userDTO.email },
          { 'accounts.kind': 'google', 'accounts.email': userDTO.email },
        ],
      }).exec();
      if (existedUser) {
        const err = Error('User already registered');
        throw err;
      }

      const passwordHash = await bcrypt.hash(userDTO.password, saltRounds);
      const userData: IUser = {
        name: userDTO.name || 'anonymous user',
        email: userDTO.email,
        role: 'regular',
        accounts: [
          {
            kind: 'internal',
            email: userDTO.email,
            userName: userDTO.name,
            passwordHash: passwordHash,
          },
        ],
      };

      const savedUser = await new UserModel(userData).save();
      const { payload, token } = this._generateToken(savedUser, 'internal');

      return { payload, token };
    } catch (e) {
      throw e;
    }
  }

  public async loginLocal(userDTO: UserDTO) {
    try {
      const existedUser = await UserModel.findOne({
        $or: [{ 'accounts.kind': 'internal', 'accounts.email': userDTO.email }],
      }).exec();

      if (!existedUser) {
        const err = Error('No user with an email ' + userDTO.email);
        throw err;
      }
      const internalUserA =
        existedUser.accounts.find(a => a.kind === 'internal') ||
        ({} as IUserAccount);

      const passwordMatch = await bcrypt.compare(
        userDTO.password,
        internalUserA.passwordHash || ''
      );

      if (passwordMatch) {
        const { payload, token } = this._generateToken(existedUser, 'internal');
        return { payload, token };
      } else {
        throw new Error('wrong password');
      }
    } catch (e) {
      throw e;
    }
  }

  public async signupGoogle(
    user?: IUser
  ): Promise<{ payload: any; token: string }> {
    if (!user) {
      throw Error('no user data');
    }

    try {
      const existedUser = await UserModel.findOne({
        $or: [
          { email: user.email },
          { 'accounts.kind': 'google', 'accounts.email': user.email },
        ],
      }).exec();
      if (existedUser) {
        const err = Error('User already registered');
        throw err;
      }

      const savedUser = await new UserModel(user).save();
      const { payload, token } = this._generateToken(savedUser, 'google');

      return { payload, token };
    } catch (e) {
      throw e;
    }
  }

  public async loginGoogle(
    user?: IUser
  ): Promise<{ payload: any; token: string }> {
    if (!user) {
      throw Error('no user data');
    }

    try {
      const existedUser = await UserModel.findOne({
        $or: [{ email: user.email }, { 'accounts.uid': user.accounts[0].uid }],
      }).exec();
      if (!existedUser) {
        const err = Error("User isn't registered");
        throw err;
      }

      const { payload, token } = this._generateToken(existedUser, 'google');

      return { payload, token };
    } catch (e) {
      throw e;
    }
  }

  _generateToken(
    userModel: IUserModel,
    accountKind: string
  ): { payload: any; token: string } {
    const payload = {
      _id: userModel._id,
      name: userModel.name,
      email: userModel.email,
      role: userModel.role,
      accountKind,
    };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: '24 days',
    });

    return { payload, token };
  }
}
