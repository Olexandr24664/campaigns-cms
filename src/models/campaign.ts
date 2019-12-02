import mongoose, { Schema } from 'mongoose';
import { ICampaign } from '../interfaces/index';

export interface ICampaignModel extends ICampaign, mongoose.Document {}

const CampaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  launchDate: Date,
  days: { type: Number, required: true },
  goal: { type: Number, required: true },
  raised: { type: Number, default: 0 },
  img: String,
  video: String,
  approved: Boolean,
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  donators: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Donator',
    },
  ],
});

const CampaignModel = mongoose.model<ICampaignModel>(
  'Campaign',
  CampaignSchema
);

export default CampaignModel;
