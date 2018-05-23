import { ObjectID } from 'mongodb';

import { IMembersRepository } from 'types/repositories/members.repository';
import { IMember } from '../../shared/types/member/member';
import { IDeploymentMember } from '../../shared/types/deployment/member';

export class MembersService {
  constructor (private _membersRepository: IMembersRepository) {}

  public async addMember(member: IMember) {
    return this._membersRepository.insert(member).then(id => id);
  }

  public getMembers() {
    return this._membersRepository.filter();
  }

  public getMemberById(memberId: ObjectID) {
    return this._membersRepository.find({ _id: memberId });
  }

  public getMemberSummary(memberId: ObjectID): Promise<IDeploymentMember> {
    return this._membersRepository.find(
      { _id: memberId },
      {
        projection: {
          firstName: true,
          lastName: true
        }
      }
    );
  }
}
