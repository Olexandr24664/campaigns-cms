import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import { CampaignController } from './controllers/campaignController';

class App {
  public app: Application;
  public campaignController: CampaignController;

  constructor() {
    this.app = express();
    this.setConfig();
    this.setMongoConfig();

    this.campaignController = new CampaignController(this.app);
  }

  private setConfig() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
  }

  private setMongoConfig() {
    mongoose.Promise = global.Promise;
    mongoose
      .connect('mongodb://localhost:27017/campaigns', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .catch(err => console.log(err));
  }
}

export default new App().app;
