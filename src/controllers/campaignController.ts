import { Application } from 'express';
import { Request, Response } from 'express';
import upload from '../multer.config';
import { CampaignService } from '../services/campaignService';

export class CampaignController {
  private campaignService: CampaignService;

  constructor(private app: Application) {
    this.campaignService = new CampaignService();
    this.routes();
  }

  public routes() {
    this.app
      .route('/campaigns')
      .get(this.getAllCampaigns)
      .post(upload, this.createNewCampaign);
    this.app.route('/campaigns/:id').get(this.getByID);
    this.app.route('/campaigns/:id/accept').patch(this.accept);
    this.app.route('/campaigns/:id/reject/').patch(this.reject);
  }

  getByID = async (req: Request, res: Response) => {
    try {
      const campaign = await this.campaignService.getById(req.params.id);
      if (campaign) {
        return res.status(200).send(campaign);
      }
      return res.status(404).send();
    } catch (e) {
      return res.status(404).send(e);
    }
  };

  getAllCampaigns = async (req: Request, res: Response) => {
    try {
      const campaigns = await this.campaignService.getAllCampaigns();
      return res.status(200).send(campaigns);
    } catch (e) {
      return res.status(404).send(e);
    }
  };

  accept = async (req: Request, res: Response) => {
    return res.status(501);
  };

  reject = async (req: Request, res: Response) => {
    return res.status(501);
  };

  createNewCampaign = async (req: Request, res: Response) => {
    try {
      let campaign;
      if (req.file) {
        campaign = await this.campaignService.createNewCampaign(
          req.body,
          req.file.path
        );
      } else {
        campaign = await this.campaignService.createNewCampaign(req.body);
      }
      return res.status(201).send(campaign);
    } catch (e) {
      return res.status(400).send(e);
    }
  };
}
