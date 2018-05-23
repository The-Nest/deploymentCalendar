import { ObjectID } from 'mongodb';

import { IDeploymentsRepository } from 'types/repositories/deployments.repository';
import { IMembersRepository } from 'types/repositories/members.repository';
import { IMember } from '../../shared/types/member/member';

export class QAService {
  constructor(
    private _deploymentsRepo: IDeploymentsRepository,
    private _membersRepo: IMembersRepository
  ) { }

  public addQA(deploymentId: ObjectID, qaId: ObjectID) {
    return this._membersRepo.find({ _id: qaId }).then((qa: IMember) => {
      return this._deploymentsRepo.update(
        { $addToSet: { qa: qa } },
        { _id: deploymentId }
      );
    });
  }

  public removeQA(deploymentId: ObjectID, qaId: ObjectID) {
    return this._deploymentsRepo.update(
      { $pull: { qa: { _id: qaId } } }
    );
  }
}
