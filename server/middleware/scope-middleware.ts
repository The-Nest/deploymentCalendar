import { GitHubService } from 'services/github.service';
import { Router, NextFunction, Response, Request } from 'express';

export function ScopeMiddlewareFactory(gitHubService: GitHubService) {
  const router = Router();
  router.use((req: Request, res: Response, next: NextFunction) => {
    const { login } = req.params;
    const authHeader = req.headers['authorization'] as string;
    gitHubService.getScope(login, authHeader);
    next();
  });
  return router;
}
