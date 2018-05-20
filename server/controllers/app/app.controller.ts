import * as path from 'path';
import { Router, Request, Response } from 'express';


const router: Router = Router();

router.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../../client/index.html'));
});

export const AppController: Router = router;
