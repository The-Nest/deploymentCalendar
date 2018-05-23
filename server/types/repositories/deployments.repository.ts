import { IDeployment } from '../../../shared/types/deployment/deployment';
import { ObjectID, FilterQuery, FindOneOptions } from 'mongodb';

export interface IDeploymentsRepository {
  filter(filter?: FilterQuery<IDeployment>, projection?: FindOneOptions): Promise<IDeployment[]>;
  find(filter?: FilterQuery<IDeployment>, projection?: FindOneOptions): Promise<IDeployment>;

  insert(document: IDeployment): Promise<ObjectID>;

  replace(document: IDeployment, filter: FilterQuery<IDeployment>): Promise<number>;

  update(patch: any, filter?: FilterQuery<IDeployment>): Promise<number>;

  delete(filter: FilterQuery<IDeployment>): Promise<number>;
}
