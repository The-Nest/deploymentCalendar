import { IMongoCollectionClient } from '../../types/clients/mongo-collection.client';

export class MongoCollectionClientMock implements IMongoCollectionClient<any> {
  public __operationResult = {};

  public operation<T>(...args): any {
    return this.__operationResult;
  }
}
