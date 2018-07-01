import { Router, Request, Response, NextFunction } from 'express';

import { IDeploymentSummary } from '../../../../shared/types/deployment/deployment-summary';
import { IDeployment } from '../../../../shared/types/deployment/deployment';
import { validateObjectId } from '../../../utils/validation-utils';
import { BranchesControllerFactory } from './branches/branches.controller';
import { DeploymentsService } from 'services/deployments.service';
import { IntegrationBranchControllerFactory } from './integration-branch/integration-branch.controller';
import { QAControllerFactory } from './qa/qa.controller';
import { GitHubService } from '../../../services/github.service';
import { AccessMiddlewareFactory } from '../../../middleware/access-middleware';
import { IGitHubClient } from 'types/clients/github.client';

export function DeploymentsControllerFactory(
  deploymentsService: DeploymentsService,
  githubClient: IGitHubClient): Router {
  const router = Router({ mergeParams: true });
  const ownerRoute = '/:owner';
  const repoRoute = `${ownerRoute}/:repo`;

  router.use(ownerRoute, AccessMiddlewareFactory(githubClient));

  router.get(
    `${ownerRoute}/summaries`,
    (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers['authorization'] as string;
      const { owner } = req.params;
      deploymentsService.getSummaries(authHeader, owner)
        .then((summaries: IDeploymentSummary[]) => res.send(summaries))
        .catch(next);
    }
  );

  router.get(
    `${repoRoute}/:id`,
    AccessMiddlewareFactory(githubClient),
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

  router.use(repoRoute, AccessMiddlewareFactory(githubClient, ['WRITE', 'ADMIN']));

  router.use(`${repoRoute}/:id/integration-branch`, IntegrationBranchControllerFactory(deploymentsService.integrationBranch));
  router.use(`${repoRoute}/:id/branches`, BranchesControllerFactory(deploymentsService.branches));
  router.use(`${repoRoute}/:id/qa`, QAControllerFactory(deploymentsService.qa));

  router.post(
    repoRoute,
    async (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers['authorization'] as string;
      return deploymentsService.addDeployment(req.body, authHeader).then(id => res.send(id)).catch(next);
    }
  );

  router.patch(
    `${repoRoute}/:id`,
    (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const oid = validateObjectId(id, next);
      deploymentsService.updateDeployment(oid, req.body).then((upsertedCount) => res.sendStatus(200));
    });

  router.delete(
    `${repoRoute}/:id`,
    (req: Request, res: Response, next: NextFunction) => {
      const oid = validateObjectId(req.params.id, next);
      deploymentsService.deleteDeployment(oid)
        .then((deleteCount: number) => res.send(deleteCount))
        .catch(next);
    });

  router.delete(
    `${repoRoute}/:id/owner`,
    (req: Request, res: Response, next: NextFunction) => {
      const oid = validateObjectId(req.params.id, next);
      deploymentsService.removeOwner(oid)
        .then((deleteCount: number) => res.sendStatus(200))
        .catch(next);
    });

  router.post(
    `${repoRoute}/:id/owner`,
    (req: Request, res: Response, next: NextFunction) => {
      const oid = validateObjectId(req.params.id, next);
      const ownerId = validateObjectId(req.body.id, next);
      deploymentsService.setOwner(oid, ownerId)
        .then((upsertCount: number) => res.sendStatus(200))
        .catch(next);
    });

  return router;
}


