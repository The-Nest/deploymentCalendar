import * as express from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { AppController } from './controllers/app/app.controller';
import { MongoDBClient } from './clients/mongodb-client';
import { deploymentsControllerFactory } from './controllers/api/deployments/deployments.controller';
import { mockDeploymentsControllerFactory } from './controllers/api/deployments/mock-deployments.controller';

async function init() {
  dotenv.config();
  const app: express.Application = express();
  app.use(express.static(path.join(__dirname, '../client')));
  if (process.env.COSMOSDB_KEY !== undefined && !process.env.USE_MOCK_API) {
    const dbClient = new MongoDBClient();
    await dbClient.connect(process.env.COSMOSDB_KEY);
    app.use('/api', deploymentsControllerFactory(dbClient));
  } else {
    app.use('/api', mockDeploymentsControllerFactory());
  }
  app.use('*',   AppController);

  const port = 3001;
  app.listen(port, () => console.log(`server started on localhost:${port}`));
}

init();
