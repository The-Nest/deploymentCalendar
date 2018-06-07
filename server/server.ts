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
import { MongoCollectionClient } from './clients/mongodb/mongo-collection.client';
import { GitHubClient } from './clients/github/github.client';
import { IDeployment } from '../shared/types/deployment/deployment';
import { IMember } from '../shared/types/member/member';
import { DeploymentsService } from './services/deployments.service';
import { MembersService } from './services/members.service';
import { DeploymentsRepository } from './repositories/deployments.repository';
import { MembersRepository } from './repositories/members.repository';
import { GitHubControllerFactory } from './controllers/api/github/github.controller';
import { getJwtToken, getInstallationAccessToken } from './clients/github/authentication/github-app-authentication';
import { GitHubService } from './services/github.service';

async function init() {
  dotenv.config();
  const gitHubClient = new GitHubClient('the-perch');
  const jwt = getJwtToken(path.join(__dirname, 'private-key.pem'), +process.env.ISSUER_ID);
  console.log(jwt);
  const token = await getInstallationAccessToken(+process.env.INSTALLATION_ID, jwt, 'the-perch');
  console.log(token);
  const res = await gitHubClient.jsonRequest(
    'GET', '/installation/repositories', token, {}, 'application/vnd.github.machine-man-preview+json');
  console.log(res);
  const mongoClient = await(new MongoClient(process.env.COSMOSDB_KEY).connect());

  const deploymentsRepository = new DeploymentsRepository(
    new MongoCollectionClient<IDeployment>(mongoClient.db('perch').collection('deployments')));
  const membersRepository = new MembersRepository(
    new MongoCollectionClient<IMember>(mongoClient.db('perch').collection('members')));

  const githubService = new GitHubService(gitHubClient);
  const deploymentsService = new DeploymentsService(deploymentsRepository, membersRepository, gitHubClient, githubService);
  const membersService = new MembersService(membersRepository);

  const app: express.Application = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, '../client')));
  app.use('/api/github', GitHubControllerFactory());
  app.use(
    '/api',
    DeploymentsControllerFactory(deploymentsService, membersRepository),
    MembersControllerFactory(membersService),
  );
  app.use('*', AppController);
  app.use(ExceptionHandler);

  const port = 3001;
  app.listen(port, () => console.log(`server started on localhost:${port}`));
}

init();
