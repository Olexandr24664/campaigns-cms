import { Application, Request, Response } from 'express';
import passport from 'passport';
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
      .post(
        passport.authenticate('jwt', {
          session: false,
          assignProperty: 'userPayload',
        }),
        upload,
        this.createNewCampaign
      );
    this.app.route('/campaigns/:id').get(this.getByID);
    this.app.route('/campaigns/:id/approve').patch(
      passport.authenticate('jwt', {
        session: false,
        assignProperty: 'userPayload',
      }),
      this.approve
    );
    this.app.route('/campaigns/:id/donate').post(
      passport.authenticate('jwt', {
        session: false,
        assignProperty: 'userPayload',
      }),
      this.donate
    );
    this.app
      .route('/campaigns/:id/donate_anonymous')
      .post(this.donateAnonymous);
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
      return campaigns.length
        ? res.status(200).send(campaigns)
        : res.sendStatus(404);
    } catch (e) {
      return res.status(404).send(e);
    }
  };

  createNewCampaign = async (req: Request, res: Response) => {
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.days ||
      !req.body.goal
    ) {
      return res.status(400).send({
        message: 'Missing required params: title | description | days | goal',
      });
    }

    if (!req.userPayload) {
      return res.sendStatus(403);
    }

    try {
      let campaign;
      if (req.file) {
        campaign = await this.campaignService.createNewCampaign(
          req.body,
          req.userPayload._id,
          req.file.path
        );
      } else {
        campaign = await this.campaignService.createNewCampaign(
          req.body,
          req.userPayload._id
        );
      }
      return res.status(201).send(campaign);
    } catch (e) {
      return res.status(400).send(e);
    }
  };

  approve = async (req: Request, res: Response) => {
    if (!req.userPayload || req.userPayload.role !== 'admin') {
      return res.sendStatus(403);
    }

    if (typeof req.body.approved !== 'boolean') {
      return res
        .status(400)
        .send({ message: 'Missing or wrong type of approve param' });
    }

    try {
      const queryResp = await this.campaignService.approve(
        req.params.id,
        req.body.approved
      );

      if (!queryResp) {
        return res.status(404).send({
          message: `Campaign with this id ${req.params.id} wasn't found`,
        });
      }

      return res.status(200).send(queryResp);
    } catch (e) {
      return res.status(500).send(e);
    }
  };

  donate = async (req: Request, res: Response) => {
    if (!req.userPayload) {
      return res.sendStatus(403);
    }

    if (!req.body.amount || req.body.amount <= 0) {
      return res.status(400).send({ message: 'Amount must be > 0' });
    }

    try {
      await this.campaignService.donate(
        req.params.id,
        req.body.amount,
        false,
        req.userPayload._id
      );
      return res.sendStatus(200);
    } catch (e) {
      return res.status(404).send(e.message);
    }
  };

  donateAnonymous = async (req: Request, res: Response) => {
    try {
      await this.campaignService.donate(req.params.id, req.body.amount, true);
      return res.sendStatus(200);
    } catch (e) {
      return res.status(404).send(e.message);
    }
  };
}
