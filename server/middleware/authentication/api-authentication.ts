import { Request, Response, NextFunction, Router } from 'express';
import { GitHubService } from 'services/github.service';

export function ApiAuthenticationHandlerFactory(gitHubService: GitHubService) {
  const router: Router = Router();
  router.use((req: Request, res: Response, next: NextFunction) => {
    // check if token in Authorization header is valid. (https://developer.github.com/v3/oauth_authorizations/#check-an-authorization)
    // If so, check the membership status of the user returned from the token validity check
    const authHeader = req.headers['authorization'] as string;
    gitHubService.validateAccessToken(authHeader).then(valid => {
      if (valid) {
        next();
      } else {
        res.sendStatus(401);
      }
    });
  });
  return router;
}
