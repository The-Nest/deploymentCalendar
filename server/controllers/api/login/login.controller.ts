import { GitHubService } from 'services/github.service';
import { Router, NextFunction, Response, Request } from 'express';
import { isNullOrUndefined } from 'util';

export function LoginControllerFactory(gitHubService: GitHubService) {
  const router = Router();
  router.use(
    '/oauth',
    (req: Request, res: Response, next: NextFunction) => {
      gitHubService.getAccessToken(req.query.code, req.query.state).then(token => res.send(token));
  });

  router.use(
    '/',
    (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers['authorization'] as string;
      gitHubService.getAuthorizationForToken(authHeader).then(async (result) => {
        if (isNullOrUndefined(result.error)) {
          res.send({
            login: result.data.user
          });
          return;
        } else if (result.statusCode === 404) {
          res.sendStatus(401);
          return;
        }
        res.sendStatus(500);
      });
    });
  return router;
}
