import { Router, NextFunction, Response, Request } from 'express';
import { GitHubWebhookControllerFactory } from './webhook/webhook.controller';
import { GitHubService } from 'services/github.service';

export function GitHubControllerFactory(gitHubService: GitHubService) {
  const router = Router();

  router.use('/webhook', GitHubWebhookControllerFactory());

  router.get('/access_token', (req: Request, res: Response, next: NextFunction) => {
    gitHubService.getAccessToken(req.query.code, req.query.state).then(token => res.send(token));
  });

  return router;
}
