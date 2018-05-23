import { Router, Request, Response, NextFunction } from 'express';
import { ObjectID } from 'mongodb';

import { QAService } from 'services/qa.service';

export function QAControllerFactory(qaService: QAService) {
  const router: Router = Router({ mergeParams: true });

  router.post('/', (req: Request, res: Response, next: NextFunction) => {
    return qaService.addQA(new ObjectID(req.params.id), new ObjectID(req.body.id)).then(() => res.sendStatus(200));
  });

  router.delete('/:qaid', (req: Request, res: Response, next: NextFunction) => {
    return qaService.removeQA(new ObjectID(req.params.id), new ObjectID(req.params.qaid)).then(() => res.sendStatus(200));
  });

  return router;
}
