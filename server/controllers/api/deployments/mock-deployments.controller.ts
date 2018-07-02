import { Router, NextFunction, Response, Request } from 'express';
import { ObjectID } from 'mongodb';

import { IDeployment } from '../../../../shared/types/deployment/deployment';
import { IDeploymentSummary } from '../../../../shared/types/deployment/deployment-summary';

export function MockDeploymentsControllerFactory(): Router {
  const router = Router();
  router.get('/:owner/summaries', (req: Request, res: Response, next: NextFunction) => {
    res.send([
      {
        name: mockDeployment.name,
        dateTime: mockDeployment.dateTime,
        owner: mockDeployment.owner,
        team: mockDeployment.team
      }
    ] as IDeploymentSummary[]);
  });

  router.get('/:owner/:repo/:id', (req: Request, res: Response, next: NextFunction) => {
    res.send(mockDeployment);
  });

  return router;
}

const mockDeployment = {
  _id: new ObjectID(1234),
  name: 'A great new feature',
  repo: {
    owner: 'the-nest',
    name: 'the-perch'
  },
  team: {
    id: 123,
    name: 'Eagle'
  },
  branches: [
    {
      name: 'feature-part-1',
      deleted: false
    },
    {
      name: 'feature-part-2',
      deleted: false
    }
  ],
  integrationBranch: {
    name: 'int-great-feature',
    deleted: false
  },
  owner: 'jsmith',
  dateTime: new Date(2018, 10, 12, 10, 30, 0, 0),
  qa: [
    'ejones',
    'j_ellis'
  ]
} as IDeployment;
