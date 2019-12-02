export interface IDonator {
  amount: number;
  anonymous: boolean;
  date: Date;
  user?: string;
  campaign: string;
}

export interface ICampaign {
  title: string;
  description: string;
  launchDate?: Date;
  days: number;
  goal: number;
  raised: number;
  img?: string;
  video?: string;
  approved?: boolean;
  user?: string;
  donators: string[];
}

export interface IUserAccount {
  kind: string;
  uid?: string;
  email?: string;
  userName?: string;
  passwordHash?: string;
}

export interface IUser {
  name: string;
  email: string;
  role: string;
  accounts: IUserAccount[];
}

export interface ICampaignController {}
