import { Router, Request, Response } from 'express';
import { MockDeployments } from '../../../../shared/mock/deployments/deployments';

export function mockDeploymentsControllerFactory() {
  const router: Router = Router();

  router.post('/deployments', (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  router.get('/deployments', (req: Request, res: Response) => {
    res.send(MockDeployments);
  });

  return router;
}
