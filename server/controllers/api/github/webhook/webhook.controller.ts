import { Router, Request, Response, NextFunction } from 'express';

export function GitHubWebhookControllerFactory() {
  const router = Router();

  router.post('/', (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    res.sendStatus(200);
  });

  return router;
}
