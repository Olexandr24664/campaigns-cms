import { MongooseDocument } from 'mongoose';

import { ICampaign } from '../types';
import { Campaign } from '../models/campaign';

export class CampaignService {
  public async getById(id: String) {
    const campaign = await Campaign.findById(id);
    return campaign;
  }

  public async getAllCampaigns() {
    return await Campaign.find();
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

  public async approve(campaignId: String, approve: Boolean) {
    const update: { approve: Boolean; launchDate?: Date } = {
      approve: approve,
    };

    if (approve === true) {
      update.launchDate = new Date();
    }

    const queryResp = await Campaign.findByIdAndUpdate(campaignId, update, {
      new: true,
    });

    return queryResp;
  }

  public delete() {}
}
