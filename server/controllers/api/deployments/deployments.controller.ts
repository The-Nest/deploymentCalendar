import { Router, Request, Response } from 'express';
import { MongoClient, MongoError, InsertOneWriteOpResult, MongoClientOptions } from 'mongodb';
import { MockDeployments } from '../../../../shared/mock/deployments/deployments';
import { MongoDBClient } from 'clients/mongodb-client';

export function deploymentsControllerFactory(db_client: MongoDBClient) {
  const router: Router = Router();
  const db = db_client.client.db('perch');
  const collection = db.collection('deployments');

  router.post('/deployments', (req: Request, res: Response) => {
    collection.insertOne(
      MockDeployments[0],
      (insError: MongoError, result: InsertOneWriteOpResult) => {
        if (insError) {
          res.sendStatus(500);
        } else {
          console.log('successfully inserted document');
          res.sendStatus(200);
        }
      }
    );
  });

  router.get('/deployments', (req: Request, res: Response) => {
    collection.find().toArray(
      (findError: MongoError, documents: any[]) => {
        if (findError) {
          res.sendStatus(500);
          return;
        }
        res.send(documents);
      });
  });

  return router;
}
