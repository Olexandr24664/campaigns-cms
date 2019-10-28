import { Application } from "express";
import { Request, Response } from "express";
import { CampaignService } from "../services/campaign.service";

export class CampaignController {
  private campaignService: CampaignService;

  constructor(private app: Application) {
    this.campaignService = new CampaignService();
    this.routes();
  }

  public routes() {
    this.app.route("/campaigns/").get();
    this.app.route("/campaigns/:id").get(this.getByID);
    this.app.route("/campaigns/:id/accept").put(this.accept);
    this.app.route("/campaigns/:id/reject/").put(this.reject);
    this.app.route("/campaigns/").post(this.createNewCampaign);
  }

  public getByID(req: Request, res: Response) {
    return res.status(200);
  }

  public async getAllCampaigns(req: Request, res: Response) {
    const campaigns = await this.campaignService.getAllCampaigns();
    res.status(200).send(campaigns);
  }

  public accept(req: Request, res: Response) {
    return res.status(200);
  }

  public reject(req: Request, res: Response) {
    return res.status(200);
  }

  createNewCampaign = async (req: Request, res: Response) => {
    try {
      const campaign = this.campaignService.createNewCampaign(req.body);
      return res.status(201).send(campaign);
    } catch (e) {
      console.log(e, "Error Hello");
      return res.status(500).send();
    }
  };
}
