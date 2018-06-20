import { GitHubService } from 'services/github.service';
import { Router, NextFunction, Response, Request } from 'express';

export function OwnerMiddlewareFactory(gitHubService: GitHubService) {
  const router = Router();
  router.use((req: Request, res: Response, next: NextFunction) => {
    gitHubService.isAppInstalled('drivetimeinc').then(isInstalled => {
      if (!isInstalled) {
        res.sendStatus(404);
        return;
      }
      next();
    });
  });
  return router;
}
