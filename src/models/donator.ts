import mongoose, { Schema } from 'mongoose';
import { IDonator } from '../interfaces/index';

interface IDonatorModel extends IDonator, mongoose.Document {}

const DonatorSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  anonymous: { type: Boolean, required: true },
  date: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
});

const DonatorModel = mongoose.model<IDonatorModel>('Donator', DonatorSchema);

export default DonatorModel;
