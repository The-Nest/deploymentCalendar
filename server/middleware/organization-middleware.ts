import { GitHubService } from 'services/github.service';
import { Router, NextFunction, Response, Request } from 'express';
import { isNullOrUndefined } from 'util';

export function OrganizationMiddlewareFactory(gitHubService: GitHubService) {
  const router = Router();

  router.use('/org/:org', (req: Request, res: Response, next: NextFunction) => {
    const { org } = req.params;
    gitHubService.getOrganizationInstallation(org).then(result => {
      if (isNullOrUndefined(result)) {
        res.sendStatus(404);
      } else {
        next();
      }
    });
  });
  return router;
}
