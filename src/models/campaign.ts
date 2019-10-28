import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
  title: String,
  description: String,
  launchDate: String,
  time: String,
  author: String,
  img: String,
  video: String
});

export const Campaign = mongoose.model("Campaign", CampaignSchema);
