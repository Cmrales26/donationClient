export enum TaskStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  Completed = 'completed'
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  delivery_date: string;
  order?: number;
  campaignId: number;
  beneficiary: number;
}

export interface TaskFormData {
  title: string;
  description?: string;
  status: TaskStatus;
  delivery_date: string;
  campaign: number;
}
