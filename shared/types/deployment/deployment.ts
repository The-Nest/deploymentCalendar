import { ObjectID } from 'mongodb';
import { IRepository } from './repository';
import { ITeam } from './team';
import { IBranch } from './branch';

export interface IDeployment {
  _id: ObjectID;
  name: string;
  repo: IRepository;
  team: ITeam;
  branches: IBranch[];
  integrationBranch: IBranch;
  owner: string;
  dateTime: Date;
  qa: string[];
}
