import * as express from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import * as cors from 'cors';

import { AppController } from './controllers/app/app.controller';
import { DeploymentsControllerFactory } from './controllers/api/deployments/deployments.controller';
import { MembersControllerFactory } from './controllers/api/members/members.controller';
import { ExceptionHandler } from './middleware/exception-handler';
import { ApiAuthenticationHandlerFactory } from './middleware/authentication/api-authentication';
import { MongoCollectionClient } from './clients/mongodb/mongo-collection.client';
import { GitHubClient } from './clients/github/github.client';
import { IDeployment } from '../shared/types/deployment/deployment';
import { IMember } from '../shared/types/member/member';
import { DeploymentsService } from './services/deployments.service';
import { MembersService } from './services/members.service';
import { DeploymentsRepository } from './repositories/deployments.repository';
import { MembersRepository } from './repositories/members.repository';
import { GitHubControllerFactory } from './controllers/api/github/github.controller';
import { GitHubService } from './services/github.service';
import { LoginControllerFactory } from './controllers/api/login/login.controller';

async function init() {
  dotenv.config();
  const gitHubClient = new GitHubClient('the-perch');
  const mongoClient = await(new MongoClient(process.env.COSMOSDB_KEY).connect());

  const deploymentsRepository = new DeploymentsRepository(
    new MongoCollectionClient<IDeployment>(mongoClient.db('perch').collection('deployments')));
  const membersRepository = new MembersRepository(
    new MongoCollectionClient<IMember>(mongoClient.db('perch').collection('members')));

  const githubService = new GitHubService(gitHubClient);
  const deploymentsService = new DeploymentsService(deploymentsRepository, membersRepository, gitHubClient, githubService);
  const membersService = new MembersService(membersRepository);

  const app: express.Application = express();
  const apiRouter: express.Router = express.Router();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, '../client')));
  app.use('/api/login', LoginControllerFactory(githubService, membersService));
  apiRouter.use('/', ApiAuthenticationHandlerFactory(githubService));
  apiRouter.use('/deployments', DeploymentsControllerFactory(deploymentsService, gitHubClient));
  apiRouter.use('/members', MembersControllerFactory(membersService));
  apiRouter.use('/*', (req: express.Request, res: express.Response) => res.sendStatus(404));
  app.use('/api', apiRouter);
  app.use('*', AppController);
  app.use(ExceptionHandler);

  const port = 3001;
  app.listen(port, () => console.log(`server started on localhost:${port}`));
}

init();
