import { GitHubService } from 'services/github.service';
import { Router, NextFunction, Response, Request } from 'express';
import { isNullOrUndefined } from 'util';
import { MembersService } from 'services/members.service';

export function LoginControllerFactory(gitHubService: GitHubService, membersService: MembersService) {
  const router = Router();
  router.use(
    '/login/oauth',
    (req: Request, res: Response, next: NextFunction) => {
      gitHubService.getAccessToken(req.query.code, req.query.state).then(token => res.send(token));
  });

  router.use(
    '/login',
    (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers['authorization'] as string;
      gitHubService.getAuthorizationForToken(authHeader).then(async (result) => {
        if (isNullOrUndefined(result.error)) {
          const member = await membersService.getMemberByGitHubId(result.data.user.id);
          res.send({
            member: member,
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
