import { NextFunction, Response, Request } from 'express';
import { isNullOrUndefined } from 'util';

import { GitHubService } from 'services/github.service';

export function RepositoryMiddlewareFactory(gitHubService: GitHubService, paramMapper: (request) => { owner: string, repo: string }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { owner, repo } = paramMapper(req);
    const authHeader = req.headers['authorization'] as string;
    gitHubService.getRepos(authHeader, owner).then(repos => {
      if (isNullOrUndefined(repos)) {
        res.sendStatus(403);
      }
      repos.findIndex(r => r === repo) >= 0 ? next() : res.sendStatus(403);
    });
  };
}
