import { MongoClient, MongoClientOptions, MongoError } from 'mongodb';

export class MongoDBClient {
  public client: MongoClient;

  public async connect(connectionString: string) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(
        connectionString,
        { useNewUrlParser: true } as MongoClientOptions,
        (error: MongoError, client: MongoClient) => {
          if (error) {
            reject(error);
          }
          this.client = client;
          console.log('MongoDB connection successful');
          resolve();
        });
    });
  }
}
