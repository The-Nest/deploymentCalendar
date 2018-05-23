import { ObjectID, Collection, FilterQuery, FindOneOptions } from 'mongodb';

import { IMembersRepository } from 'types/repositories/members.repository';
import { isNullOrUndefined, isArray } from 'util';
import { MongoCollectionClient } from 'clients/mongodb/mongo-collection.client';
import { IMember } from '../../shared/types/member/member';

export class MembersRepository implements IMembersRepository {
  constructor(private _mongoClient: MongoCollectionClient<IMember>) { }

  public filter(filter: FilterQuery<IMember> = {}, projection?: FindOneOptions): Promise<IMember[]> {
    return this._mongoClient.operation<Promise<IMember[]>>(collection => collection.find(filter, projection).toArray());
  }

  public find(filter: FilterQuery<IMember> = {}, projection?: FindOneOptions): Promise<IMember> {
    return this._mongoClient.operation<Promise<IMember>>(collection => collection.findOne(filter, projection));
  }

  public insert(document: IMember): Promise<ObjectID> {
    return this._mongoClient.operation<Promise<ObjectID>>(collection => collection.insertOne(document).then(result => result.insertedId));
  }

  public replace(document: IMember, filter: FilterQuery<IMember>): Promise<number> {
    return this._mongoClient.operation<Promise<number>>(collection =>
      collection.replaceOne(filter, document).then(result => result.upsertedCount));
  }

  public update(patch: any, filter: FilterQuery<IMember> = {}): Promise<number> {
    return this._mongoClient.operation<Promise<number>>(collection =>
      collection.updateMany(filter, patch).then(result => result.upsertedCount));
  }

  public delete(filter: FilterQuery<IMember>): Promise<number> {
    return this._mongoClient.operation<Promise<number>>(collection =>
      collection.deleteMany(filter).then(result => result.deletedCount));
  }
}
