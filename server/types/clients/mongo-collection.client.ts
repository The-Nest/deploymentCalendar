import { Collection } from 'mongodb';

export interface IMongoCollectionClient<TDocuments> {
  operation<T>(operation: (collection: Collection<TDocuments>) => T): T;
}
