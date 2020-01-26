import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from './passport.config';
import {
  CLOUD_DB,
  MONGO_CLOUD_CONNECTION_STRING,
  MONGO_LOCAL_CONNECTION_STRING,
} from './dotenv.config';
import { CampaignController } from './controllers/campaignController';
import { AuthController } from './controllers/authController';
import { UserController } from './controllers/userController';
import cookieParser from 'cookie-parser';
import DonatorModel from './models/donator';
import CampaignModel from './models/campaign';
import UserModel from './models/user';
class App {
  public app: Application;
  public campaignController: CampaignController;
  public authController: AuthController;
  public userController: UserController;

  constructor() {
    this.app = express();
    this.setConfig();
    this.setMongoConfig();
    this.campaignController = new CampaignController(this.app);
    this.authController = new AuthController(this.app);
    this.userController = new UserController(this.app);
  }

  private setConfig() {
    this.app.use(cookieParser());
    this.app.use(bodyParser.json({ limit: '15mb' }));
    this.app.use(bodyParser.urlencoded({ extended: true, limit: '15mb' }));
    this.app.use('/uploads', express.static('uploads'));
    this.app.use(
      cors({
        credentials: true,
        origin: ['http://localhost:3000'],
      })
    );
    this.app.use(passport.initialize());
    this.app.set('view engine', 'pug');
    this.app.set('views', './src/views');
  }

  private async setMongoConfig() {
    if (!CLOUD_DB) {
      await this.setMongoLocalConfig();
    } else {
      await this.setMongoCloudConfig();
    }
    await UserModel.createCollection();
    await CampaignModel.createCollection();
    await DonatorModel.createCollection();
  }

  private async setMongoLocalConfig() {
    mongoose.Promise = global.Promise;
    try {
      const connectionString = MONGO_LOCAL_CONNECTION_STRING;
      await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        autoCreate: true,
      });
      console.log('Local Mongo is connected');
    } catch (e) {
      console.log(e);
    }
  }

  private async setMongoCloudConfig() {
    mongoose.Promise = global.Promise;
    try {
      const connectionString = MONGO_CLOUD_CONNECTION_STRING;

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
