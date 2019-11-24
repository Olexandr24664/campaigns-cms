import mongoose from 'mongoose';
import { ICampaign } from '../types/index';

interface ICampaignModel extends ICampaign, mongoose.Document {}

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: String,
  launchDate: Date,
  days: { type: Number, required: true },
  img: String,
  video: String,
  goal: { type: Number, required: true },
  raised: { type: Number, default: 0 },
  approve: Boolean,
});

export const Campaign = mongoose.model<ICampaignModel>(
  'Campaign',
  campaignSchema
);
