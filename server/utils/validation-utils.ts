import { NextFunction } from 'express';
import { ObjectID } from 'mongodb';

export function validateObjectId(idString: string, next: NextFunction): ObjectID {
  let oid: ObjectID;
  try {
    oid = new ObjectID(idString);
  } catch {
    next({
      message: 'Malformed document ID',
      statusCode: 400
    });
  }
  return oid;
}
