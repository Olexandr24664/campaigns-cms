import './dotenv.config';
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
    // this.setMongoCloudConfig();
    this.campaignController = new CampaignController(this.app);
  }

  private setConfig() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use('/uploads', express.static('uploads'));
    this.app.use(cors());
  }

  private async setMongoConfig() {
    if (process.env.CLOUD_DB === 'false') {
      this.setMongoLocalConfig();
    } else {
      this.setMongoCloudConfig();
    }
  }

  private async setMongoLocalConfig() {
    mongoose.Promise = global.Promise;
    try {
      await mongoose.connect('mongodb://localhost:27017/campaigns', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
    } catch (e) {
      console.log(e);
    }
  }

  private async setMongoCloudConfig() {
    mongoose.Promise = global.Promise;
    try {
      const connectionString: string =
        process.env.MONGO_CLOUD_CONNECTION_STRING || '';

      await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
    } catch (e) {
      console.log(e);
    }
  }
}

export default new App().app;
