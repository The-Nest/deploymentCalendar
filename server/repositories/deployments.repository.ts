import { FilterQuery, FindOneOptions, ObjectID } from 'mongodb';

import { IDeploymentsRepository } from 'types/repositories/deployments.repository';
import { IDeployment } from '../../shared/types/deployment/deployment';
import { MongoCollectionClient } from '../clients/mongodb/mongo-collection.client';

export class DeploymentsRepository implements IDeploymentsRepository {
  constructor(private _mongoClient: MongoCollectionClient<IDeployment>) { }

  public filter(filter: FilterQuery<IDeployment> = {}, projection?: FindOneOptions): Promise<IDeployment[]> {
    return this._mongoClient.operation<Promise<IDeployment[]>>(collection => collection.find(filter, projection).toArray());
  }

  public find(filter: FilterQuery<IDeployment> = {}, projection?: FindOneOptions): Promise<IDeployment> {
    return this._mongoClient.operation<Promise<IDeployment>>(collection => collection.findOne(filter, projection));
  }

  public insert(document: IDeployment): Promise<ObjectID> {
    return this._mongoClient.operation<Promise<ObjectID>>(collection => collection.insertOne(document).then(result => result.insertedId));
  }

  public replace(document: IDeployment, filter: FilterQuery<IDeployment>): Promise<number> {
    return this._mongoClient.operation<Promise<number>>(collection =>
      collection.replaceOne(filter, document).then(result => result.upsertedCount));
  }

  public update(patch: any, filter: FilterQuery<IDeployment> = {}): Promise<number> {
    return this._mongoClient.operation<Promise<number>>(collection =>
      collection.updateMany(filter, patch).then(result => result.upsertedCount));
  }

  public delete(filter: FilterQuery<IDeployment>): Promise<number> {
    return this._mongoClient.operation<Promise<number>>(collection =>
      collection.deleteMany(filter).then(result => result.deletedCount));
  }
}
