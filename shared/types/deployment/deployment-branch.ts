import { ITeamMember } from '../team/team-member';
import { IPullRequest } from './pull-request';

export interface IDeploymentBranch {
  name: string;
  pullRequest?: IPullRequest;
  assignee: ITeamMember;
  deleted: boolean;
}
