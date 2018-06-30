import { NextFunction, Response, Request } from 'express';
import { isNullOrUndefined } from 'util';

import { GitHubService } from 'services/github.service';

export function RepositoryMiddlewareFactory(gitHubService: GitHubService) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { owner, repo } = req.params;
    const authHeader = req.headers['authorization'] as string;
    gitHubService.getRepos(authHeader, owner).then(repos => {
      if (isNullOrUndefined(repos)) {
        res.sendStatus(404);
      }
      repos.findIndex(r => r === repo) >= 0 ? next() : res.sendStatus(404);
    });
  };
}
