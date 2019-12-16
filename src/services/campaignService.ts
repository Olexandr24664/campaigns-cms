import { ICampaign, IDonator } from '../interfaces';
import CampaignModel from '../models/campaign';
import DonatorModel from '../models/donator';
import { startSession } from 'mongoose';

export class CampaignService {
  public async getById(id: string) {
    const campaign = await CampaignModel.findById(id)
      .populate({
        path: 'donators',
        select: 'amount date anonymous',
        populate: { path: 'user', select: '_id name' },
      })
      .populate('user', '_id name')
      .exec();
    return campaign;
  }

  public async getAllCampaigns() {
    return await CampaignModel.find()
      .populate({
        path: 'donators',
        select: 'amount date anonymous',
        populate: { path: 'user', select: '_id name' },
      })
      .populate('user', '_id name')
      .exec();
  }

  public async createNewCampaign(
    campaignData: ICampaign,
    userId: string,
    imgPath?: string
  ) {
    if (imgPath) {
      campaignData.img = imgPath;
    }
    campaignData.user = userId;
    const newCampaign = new CampaignModel(campaignData);
    try {
      return await newCampaign.save();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async approve(campaignId: string, approved: boolean) {
    const update: { approved: Boolean; launchDate?: Date } = {
      approved: approved,
    };

    if (approved === true) {
      update.launchDate = new Date();
    }

    const queryResp = await CampaignModel.findByIdAndUpdate(
      campaignId,
      update,
      {
        new: true,
      }
    ).exec();

    return queryResp;
  }

  public delete() {}

  public async donate(
    campaignId: string,
    amount: number,
    anonymous: boolean,
    userId?: string
  ) {
    const session = await startSession();
    try {
      await session.withTransaction(async () => {
        const campaign = await CampaignModel.findById(campaignId)
          .populate('donators')
          .session(session)
          .exec();
        if (!campaign) {
          throw new Error('Campaign not found');
        }

        if (campaign.approved !== true) {
          throw new Error('Campaign not approved');
        }
        const difference = campaign.raised + amount - campaign.goal;
        if (difference > 0) {
          throw new Error('Too much money, left difference = ' + difference);
        }

        const donatorData: IDonator = {
          amount,
          anonymous,
          date: new Date(),
          user: userId,
          campaign: campaignId,
        };

        const newDonator = await new DonatorModel(donatorData).save({
          session,
        });

        campaign.raised += amount;
        campaign.donators.push(newDonator._id);
        await campaign.save({ session });
      });
      return true;
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      session.endSession();
    }
  }
}
