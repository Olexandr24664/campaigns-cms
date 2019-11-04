import { Application, Request, Response } from 'express';
import upload from '../multer.config';
import { CampaignService } from '../services/campaignService';
import { ICampaignController } from '../types/index';

export class CampaignController implements ICampaignController {
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
    this.app.route('/campaigns/:id/approve').patch(this.approve);
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

  approve = async (req: Request, res: Response) => {
    if (typeof req.body.approve !== 'boolean') {
      return res
        .status(400)
        .send({ message: 'No or wrong type of approve param' });
    }

    try {
      const queryResp = await this.campaignService.approve(
        req.params.id,
        req.body.approve
      );

      if (!queryResp) {
        return res.status(404).send({
          message: `Campaign with this id ${req.params.id} wasn't found`,
        });
      }

      return res.status(501).send(queryResp);
    } catch (e) {
      return res.status(500).send(e);
    }
  };
}
