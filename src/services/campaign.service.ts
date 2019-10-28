import { Request, Response } from "express";
import { MongooseDocument } from "mongoose";

import { Campaign } from "../models/campaign";

export class CampaignService {
  public getById(id: String) {}

  public async getAllCampaigns() {
    try {
      return await Campaign.find();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async createNewCampaign(campaignData: Object) {
    const newCampaign = new Campaign(campaignData);

    try {
      await newCampaign.save();
      return newCampaign;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public update() {}

  public delete() {}
}
