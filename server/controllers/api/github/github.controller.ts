import { Router } from 'express';
import { GitHubWebhookControllerFactory } from './webhook/webhook.controller';

export function GitHubControllerFactory() {
  const router = Router();

  router.use('/webhook', GitHubWebhookControllerFactory());

  return router;
}
