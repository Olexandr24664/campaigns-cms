export interface ICampaign {
  title: string;
  user_id?: string;
  description?: string;
  launchDate?: Date;
  days: string;
  img?: string;
  video?: string;
  goal: number;
  raised: number;
  approve?: boolean;
  donators_ids: string[];
}

export interface IUser {
  name: string;
}

export interface ICampaignController {}
