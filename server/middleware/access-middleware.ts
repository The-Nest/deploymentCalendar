import { NextFunction, Response, Request } from 'express';
import { isNullOrUndefined } from 'util';

import { GitHubService } from 'services/github.service';
import { IGitHubClient } from 'types/clients/github.client';

export function AccessMiddlewareFactory(gitHubClient: IGitHubClient, repoScopes = ['READ']) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { owner, repo } = req.params;
    console.log(owner, repo);
    const authHeader = req.headers['authorization'] as string;
    const includeRepo = !isNullOrUndefined(repo);

    let query = `query {
      repositoryOwner(login: "${owner}") {
        login
      }
    }`;
    if (includeRepo) {
      query = `query {
        repositoryOwner(login: "${owner}") {
          login,
          repository(name: "${repo}") {
            viewerPermission
          }
        }
      }`;
    }
    gitHubClient.graphQLRequest(query, authHeader).then((resp) => {
      console.log(resp);
      if (!isNullOrUndefined(resp.errors)) {
        // handle errors...
      }
      const data = resp.data;
      if (isNullOrUndefined(data.repositoryOwner)) {
        // owner does not exist
        res.sendStatus(404);
        return;
      }
      if (includeRepo) {
        if (isNullOrUndefined(data.repositoryOwner.repository)) {
          // repo does not exist or the user cannot access it
          res.sendStatus(404);
          return;
        }
        if (repoScopes.findIndex(s => s === data.repositoryOwner.repository.viewerPermission) === -1) {
          // user doesn't have required access rights
          res.sendStatus(403);
          return;
        }
      }
      next();
    });
  };
}