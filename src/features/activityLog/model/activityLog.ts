import { DefaultInitialState } from "../../../redux/model";

export interface ActivityLogState extends DefaultInitialState {
  activityLogs: ActivityLog[] | null;
  nextToken: string | null;
  totalRows: number;
}

export interface ActivityLog {
  track: string,
  event: string,
  log_category: string,
  log_name: string,
  status: string,
  scenario: string,
  at: string,
  meta: Meta[] | null;
}

export interface Meta {
  key: string;
  value: string;
}

export interface SearchActivityLogInput {
  profileId: string;
  startDate: string;
  endDate: string;
  limit: number;
  nextToken: string | null;
}
