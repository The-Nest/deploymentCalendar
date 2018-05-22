import { PullRequestStatus } from '../../enums/deployment/pull-request-status';


export interface IPullRequest {
  id: number;
  status: PullRequestStatus;
}
