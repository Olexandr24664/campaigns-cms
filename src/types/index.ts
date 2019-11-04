export interface ICampaign {
  title: String;
  user_id?: String;
  description?: String;
  launchDate?: Date;
  days: Number;
  img?: String;
  video?: String;
  approve?: Boolean;
}

export interface IUser {
  name: String;
}

export interface ICampaignController {}
