import { PullRequestStatus } from '../../enums/deployment/pull-request-status';
import { IMember } from '../member/member';


export interface IPullRequest {
  id: number;
  status: PullRequestStatus;
  assignee: IMember;
}
