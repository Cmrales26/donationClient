import { UserData } from './userData';

export interface Campaign {
  id: number;
  user_data: UserData;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  user: number;
  create_by: number;
  updated_by: number | null;
}

export interface CampaignFormData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status?: CampaignStatus;
  user: number;
}

export enum CampaignStatus {
  Active = 'active',
  Closed = 'closed',
  Canceled = 'canceled'
}
