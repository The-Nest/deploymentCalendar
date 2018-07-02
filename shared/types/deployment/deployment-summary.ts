import { ITeam } from './team';
import { IDeploymentMember } from './member';

export interface IDeploymentSummary {
  name: string;
  dateTime: Date;
  owner: string;
  team: ITeam;
}
