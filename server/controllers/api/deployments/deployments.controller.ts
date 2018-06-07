import { Router, Request, Response, NextFunction } from 'express';
import { ObjectID } from 'mongodb';

import { IDeploymentSummary } from '../../../../shared/types/deployment/deployment-summary';
import { IDeployment } from '../../../../shared/types/deployment/deployment';
import { IGitHubClient } from '../../../types/clients/github.client';
import { validateObjectId } from '../../../utils/validation-utils';
import { IMembersRepository } from 'types/repositories/members.repository';
import { BranchesControllerFactory } from './branches/branches.controller';
import { DeploymentsService } from 'services/deployments.service';
import { IntegrationBranchControllerFactory } from './integration-branch/integration-branch.controller';
import { QAControllerFactory } from './qa/qa.controller';

export function DeploymentsControllerFactory(
  deploymentsService: DeploymentsService,
  membersRepository: IMembersRepository): Router {
  const router = Router();
  const resourceRoute = '/deployments';

  router.post('/github/webhook', (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
  });

  router.use(`${resourceRoute}/:id/integration-branch`, IntegrationBranchControllerFactory(deploymentsService.integrationBranch));
  router.use(`${resourceRoute}/:id/branches`, BranchesControllerFactory(deploymentsService.branches));
  router.use(`${resourceRoute}/:id/qa`, QAControllerFactory(deploymentsService.qa));

  router.post(
    resourceRoute,
    async (req: Request, res: Response, next: NextFunction) =>
      deploymentsService.addDeployment(req.body).then(id => res.send(id)).catch(next)
  );

  router.get(
    `${resourceRoute}/summaries`,
    (req: Request, res: Response, next: NextFunction) => deploymentsService.getSummaries()
      .then((summaries: IDeploymentSummary[]) => res.send(summaries))
      .catch(next)
  );

  router.get(
    resourceRoute,
    (req: Request, res: Response, next: NextFunction) => deploymentsService.getDeployments()
      .then((deployments: IDeployment[]) => res.send(deployments))
      .catch(next)
  );

  router.get(
    `${resourceRoute}/:id`,
    (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const oid = validateObjectId(id, next);
      deploymentsService.getDeployment(oid).then((deployment: IDeployment) => {
        if (deployment === null) {
          next({ statusCode: 404, message: `Document with ID ${id} not found.` });
        } else {
          res.send(deployment);
        }
      });
    }
  );

  router.patch(
    `${resourceRoute}/:id`,
    (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const oid = validateObjectId(id, next);
      deploymentsService.updateDeployment(oid, req.body).then((upsertedCount) => res.sendStatus(200));
    });

  router.delete(
    `${resourceRoute}/:id`,
    (req: Request, res: Response, next: NextFunction) => {
      const oid = validateObjectId(req.params.id, next);
      deploymentsService.deleteDeployment(oid)
        .then((deleteCount: number) => res.send(deleteCount))
        .catch(next);
    });

  router.delete(
    `${resourceRoute}/:id/owner`,
    (req: Request, res: Response, next: NextFunction) => {
      const oid = validateObjectId(req.params.id, next);
      deploymentsService.removeOwner(oid)
        .then((deleteCount: number) => res.sendStatus(200))
        .catch(next);
    });

  router.post(
    `${resourceRoute}/:id/owner`,
    (req: Request, res: Response, next: NextFunction) => {
      const oid = validateObjectId(req.params.id, next);
      const ownerId = validateObjectId(req.body.id, next);
      deploymentsService.setOwner(oid, ownerId)
        .then((upsertCount: number) => res.sendStatus(200))
        .catch(next);
    });

  return router;
}


