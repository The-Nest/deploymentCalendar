import { Router, Request, Response, NextFunction } from 'express';
import { ObjectID } from 'mongodb';

import { IMembersRepository } from 'types/repositories/members.repository';
import { validateObjectId } from '../../../utils/validation-utils';
import { IMember } from '../../../../shared/types/member/member';
import { MembersService } from 'services/members.service';
import { MembersRepository } from 'repositories/members.repository';

export function MembersControllerFactory(membersService: MembersService) {
  const router = Router();
  const resourceRoute = '/members';

  router.post(
    resourceRoute,
    (req: Request, res: Response, next: NextFunction) => {
      membersService.addMember(req.body)
        .then((oid: ObjectID) => res.send(oid))
        .catch(next);
    }
  );

  router.get(
    resourceRoute,
    (req: Request, res: Response, next: NextFunction) => {
      membersService.getMembers()
        .then((members: IMember[]) => res.send(members))
        .catch(next);
    }
  );

  router.get(
    `${resourceRoute}/:id`,
    (req: Request, res: Response, next: NextFunction) => {
      const oid = validateObjectId(req.params.id, next);
      membersService.getMemberById(oid)
        .then((members: IMember) => res.send(members))
        .catch(next);
    }
  );

  return router;
}
