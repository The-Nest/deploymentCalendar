import { Router, NextFunction, Response, Request } from 'express';
import { ObjectID } from 'mongodb';

import { IBranchPayload } from '../../../../../shared/types/deployment/payloads/branch';
import { BranchesService } from 'services/branches.service';

export function BranchesControllerFactory(branchesService: BranchesService) {
  const router: Router = Router({ mergeParams: true });

  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    branchesService.getBranches(new ObjectID(req.params.id)).then(branches => res.send(branches));
  });

  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'] as string;
    branchesService.addBranch(new ObjectID(req.params.id), req.body, authHeader).then((upsertCount) => res.sendStatus(200));
  });

  router.delete('/:branchName', async (req: Request, res: Response, next: NextFunction) => {
    const branchName = req.params.branchName;
    branchesService.removeBranch(new ObjectID(req.params.id), branchName).then((upsertCount) => res.sendStatus(200));
  });

  router.patch('/:branchName', async (req: Request, res: Response, next: NextFunction) => {
    const payload: IBranchPayload = req.body;
    const branchName = req.params.branchName;
    branchesService.updateBranch(new ObjectID(req.params.id), branchName, payload).then(upsertCount => res.sendStatus(200));
  });

  return router;
}
