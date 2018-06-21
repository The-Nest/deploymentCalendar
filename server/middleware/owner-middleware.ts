import { GitHubService } from 'services/github.service';
import { Router, NextFunction, Response, Request } from 'express';

export function OwnerMiddlewareFactory(gitHubService: GitHubService, parameterMapper: (r: Request) => { login: string }) {
  const router = Router({ mergeParams: true });
  router.use((req: Request, res: Response, next: NextFunction) => {
    const paramMap = parameterMapper(req);
    gitHubService.isAppInstalled(paramMap.login).then(isInstalled => {
      if (!isInstalled) {
        res.sendStatus(404);
        return;
      }
      next();
    });
  });
  return router;
}
