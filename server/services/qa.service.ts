import { ObjectID } from 'mongodb';

import { IDeploymentsRepository } from 'types/repositories/deployments.repository';
import { GitHubService } from './github.service';

export class QAService {
  constructor(
    private _deploymentsRepo: IDeploymentsRepository,
    private _gitHubService: GitHubService
  ) { }

  public async addQA(deploymentId: ObjectID, qaLogin: string, accessToken: string): Promise<number> {
    const { repo } = await this._deploymentsRepo.find(
      { _id: deploymentId },
      {
        projection: {
          repo: true
        }
      }
    );
    if (this._gitHubService.isCollaborator(repo.owner, repo.name, qaLogin, accessToken)) {
      return this._deploymentsRepo.update(
        { $addToSet: { qa: qaLogin } },
        { _id: deploymentId }
      );
    }
    return 0;
  }

  public removeQA(deploymentId: ObjectID, qaLogin: string) {
    return this._deploymentsRepo.update(
      { $pull: { qa: qaLogin } },
      { _id: deploymentId }
    );
  }
}
