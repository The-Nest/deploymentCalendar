import { Router, NextFunction, Response, Request } from 'express';
import { GitHubWebhookControllerFactory } from './webhook/webhook.controller';
import { GitHubService } from 'services/github.service';

export function GitHubControllerFactory(gitHubService: GitHubService) {
  const router = Router();

  router.use('/github/webhook', GitHubWebhookControllerFactory());

  return router;
}
