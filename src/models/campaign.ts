import mongoose from 'mongoose';
import { ICampaign } from '../types/index';

interface ICampaignModel extends ICampaign, mongoose.Document {}

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: String,
  launchDate: String,
  time: String,
  author: String,
  img: String,
  video: String,
});

export const Campaign = mongoose.model<ICampaignModel>(
  'Campaign',
  campaignSchema
);
