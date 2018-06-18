import { GitHubService } from 'services/github.service';
import { Router, NextFunction, Response, Request } from 'express';
import { isNullOrUndefined } from 'util';

export function OrganizationMiddlewareFactory(gitHubService: GitHubService) {
  const router = Router();

  router.use('/org/:org', (req: Request, res: Response, next: NextFunction) => {
    const { org } = req.params;
    const authHeader = req.headers['authorization'] as string;
    gitHubService.getOrganizationInstallation(org).then(result => {
      if (isNullOrUndefined(result)) {
        res.sendStatus(404);
      } else {
        gitHubService.getAuthorizationForToken(authHeader).then(authResult => {
          if (authResult.statusCode === 404) {
            // Bad token (invalid or revoked)
            res.sendStatus(401);
          } else {
            gitHubService.checkMembership(org, authResult.data.user.login, authHeader).then(membershipResult => {
              if (!membershipResult) {
                res.sendStatus(403);
              }
            });
          }
        });
        next();
      }
    });
  });
  return router;
}
