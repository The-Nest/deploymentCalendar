import { ObjectID } from 'mongodb';
import { IRepository } from './repository';
import { ITeam } from './team';
import { IBranch } from './branch';
import { IDeploymentMember } from './member';

export interface IDeployment {
  _id: ObjectID;
  name: string;
  repo: IRepository;
  team: ITeam;
  branches: IBranch[];
  integrationBranch: IBranch;
  owner: IDeploymentMember;
  dateTime: Date;
  teamLocation: string;
  qa: IDeploymentMember[];
}
