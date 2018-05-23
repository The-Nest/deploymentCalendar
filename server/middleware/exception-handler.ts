import { Request, Response, NextFunction } from 'express';

export function ExceptionHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  res.status(err.statusCode ? err.statusCode : 500).send(err);
}
