import { GitHubService } from 'services/github.service';
import { Router, NextFunction, Response, Request } from 'express';
import { isNullOrUndefined } from 'util';

export function userMiddlewareFactory(gitHubService: GitHubService) {
  const router = Router();

  router.use('/user/:user', (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.params;
    gitHubService.getUserInstallation(user).then(result => {
      if (isNullOrUndefined(result)) {
        res.sendStatus(404);
      } else {
        next();
      }
    });
  });
  return router;
}
