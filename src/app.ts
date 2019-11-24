import './dotenv.config';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { CampaignController } from './controllers/campaignController';
import { AuthController } from './controllers/authController';

class App {
  public app: Application;
  public campaignController: CampaignController;
  public authController: AuthController;

  constructor() {
    this.app = express();
    this.setConfig();
    this.setMongoConfig();
    // this.setMongoCloudConfig();
    this.campaignController = new CampaignController(this.app);
    this.authController = new AuthController(this.app);
  }

  private setConfig() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use('/uploads', express.static('uploads'));
    this.app.set('view engine', 'pug');
    this.app.set('views', './src/views');
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
      const connectionString: string =
        process.env.MONGO_LOCAL_CONNECTION_STRING ||
        'mongodb://localhost:27017/campaigns';
      await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
      console.log('Local Mongo is connected');
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
      console.log('Cloud Mongo is connected');
    } catch (e) {
      console.log(e);
    }
  }
}

export default new App().app;
