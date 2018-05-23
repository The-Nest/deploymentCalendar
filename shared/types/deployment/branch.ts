import { IPullRequest } from './pull-request';
import { IDeploymentMember } from './member';

export interface IBranch {
  name: string;
  pullRequest?: IPullRequest;
  deleted: boolean;
}
