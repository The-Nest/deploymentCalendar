import { Router, Request, Response, NextFunction } from 'express';
import { ObjectID } from 'mongodb';

import { QAService } from 'services/qa.service';

export function QAControllerFactory(qaService: QAService) {
  const router: Router = Router({ mergeParams: true });

  router.post('/', (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'] as string;
    return qaService.addQA(new ObjectID(req.params.id), req.body.qaLogin, authHeader).then(() => res.sendStatus(200));
  });

  router.delete('/:qaLogin', (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'] as string;
    return qaService.removeQA(new ObjectID(req.params.id), req.params.qaLogin).then(() => res.sendStatus(200));
  });

  return router;
}
