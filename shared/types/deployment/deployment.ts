import { IDeploymentBranch } from './deployment-branch';
import { ITeamMember } from '../team/team-member';
import { ITeam } from '../team/team';
import { IRepository } from '../repository/repository';

export interface IDeployment {
  repo: IRepository;
  team: ITeam;
  branches: IDeploymentBranch[];
  integrationBranch: IDeploymentBranch;
  owner: ITeamMember;
  dateTime: Date;
  teamLocation: string; // dynamic
  qa: ITeamMember[];
}
