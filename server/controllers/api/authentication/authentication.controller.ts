import { GitHubService } from 'services/github.service';
import { MembersService } from 'services/members.service';
import { Router, NextFunction, Response, Request } from 'express';
import { isNullOrUndefined } from 'util';

export function AuthenticationControllerFactory(gitHubService: GitHubService, membersService: MembersService) {
  const router = Router();

  router.get('/login', (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'] as string;
    gitHubService.getAuthorizationForToken(authHeader).then(async (result) => {
      if (isNullOrUndefined(result.error)) {
        const member = await membersService.getMemberByGitHubId(result.data.user.id);
        if (isNullOrUndefined(member)) {
          res.sendStatus(404);
          return;
        } else {
          // TODO: check if user is allowed access to resources/organization resources
          // If not, return 403
        }
        res.send(member);
      } else if (result.statusCode === 404) {
        // bad token (invalid or revoked)
        res.sendStatus(401);
      }
      res.sendStatus(500);
    });
  });

  router.get('/access_token', (req: Request, res: Response, next: NextFunction) => {
    gitHubService.getAccessToken(req.query.code, req.query.state).then(token => res.send(token));
  });

  return router;
}
