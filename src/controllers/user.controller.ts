import { Application } from "express";
import { Request, Response } from "express";
import { CampaignService } from "../services/campaign.service";

export class UserController {
  private userService: CampaignService;

  constructor(private app: Application) {
    this.userService = new CampaignService();
    this.routes();
  }

  public routes() {}
}
