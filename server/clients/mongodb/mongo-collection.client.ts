import { MongoClient, Db, Collection } from 'mongodb';
import { IMongoCollectionClient } from 'types/clients/mongo-collection.client';

export class MongoCollectionClient<TDocuments> implements IMongoCollectionClient<TDocuments> {
  constructor(private _collection: Collection<TDocuments>) { }

  public operation<T>(operation: (collection: Collection<TDocuments>) => T): T {
    return operation(this._collection);
  }
}
