import { MongooseDocument } from 'mongoose';

import { ICampaign } from '../types';
import { Campaign } from '../models/campaign';

export class CampaignService {
  public async getById(id: String) {
    const campaign = await Campaign.findById(id);
    return campaign;
  }

  public async getAllCampaigns() {
    try {
      return await Campaign.find();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async createNewCampaign(campaignData: ICampaign, imgPath?: String) {
    if (imgPath) {
      campaignData.img = imgPath;
    }

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
