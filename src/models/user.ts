import mongoose from 'mongoose';
import { IUser } from '../interfaces/index';

export interface IUserModel extends IUser, mongoose.Document {}

const UserAccountSchema = new mongoose.Schema({
  kind: { type: String, requeired: true },
  uid: String,
  email: String,
  userName: String,
  passwordHash: String,
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  role: String,
  accounts: [UserAccountSchema],
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret._id;
  },
});

const UserModel = mongoose.model<IUserModel>('User', UserSchema);

export default UserModel;
