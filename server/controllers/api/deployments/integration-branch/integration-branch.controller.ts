import { Router, Response, NextFunction, Request } from 'express';
import { ObjectID } from 'mongodb';

import { IntegrationBranchService } from 'services/integration-branch.service';

export function IntegrationBranchControllerFactory(integrationBranchService: IntegrationBranchService) {
  const router: Router = Router({ mergeParams: true });

  router.post('/', (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'] as string;
    integrationBranchService.addIntegrationBranch(new ObjectID(req.params.id), req.body, authHeader)
      .then((upsertCount) => res.sendStatus(200));
  });

  router.delete('/', (req: Request, res: Response, next: NextFunction) => {
    integrationBranchService.removeIntegrationBranch(new ObjectID(req.params.id)).then((upsertCount) => res.sendStatus(200));
  });

  router.patch('/', (req: Request, res: Response, next: NextFunction) => {
    integrationBranchService.updateIntegrationBranch(new ObjectID(req.params.id), req.body).then((upsertCount) => res.sendStatus(200));
  });

  return router;
}
