import { ObjectID } from 'mongodb';
import { isNullOrUndefined } from 'util';

import { IBranchPayload } from '../../shared/types/deployment/payloads/branch';
import { IBranch } from '../../shared/types/deployment/branch';
import { IDeploymentsRepository } from 'types/repositories/deployments.repository';
import { GitHubService } from './github.service';

export class BranchesService {
  constructor(
    private _deploymentsRepo: IDeploymentsRepository,
    private _gitHubService: GitHubService) { }

  public async getBranches(deploymentId: ObjectID): Promise<IBranch[]> {
    return this._deploymentsRepo.find(
      { _id: deploymentId },
      { projection: { branches: true } })
        .then(deployment => deployment.branches);
  }

  public async addBranch(deploymentId: ObjectID, branch: IBranchPayload, accessToken: string): Promise<number> {
    // need to grab repo data for deployment so we can get data from GitHub
    const { repo } = await this._deploymentsRepo.find(
      { _id: deploymentId },
      { projection: {
        repo: true
      }
    });
    const branchData = await this._gitHubService.getBranch(repo.owner, repo.name, branch.name, accessToken);
    const mappedBranch = {
      name: branchData.name,
      deleted: false
    } as IBranch;
    return this._deploymentsRepo.update(
      { $addToSet: { branches: mappedBranch } },
      { _id: deploymentId }
    );
  }

  public removeBranch(deploymentId: ObjectID, branchName: string) {
    return this._deploymentsRepo.update(
      { $pull: { branches: { name: branchName } } },
      { _id: deploymentId }
    );
  }

  public async updateBranch(deploymentId: ObjectID, branchName: string, branch: IBranchPayload) {
    const branches = await this._deploymentsRepo.find({ _id: deploymentId })
      .then(match => match.branches);
    const currentBranch = branches.find(b => b.name === branchName);
    currentBranch.deleted = isNullOrUndefined(branch.deleted) ? currentBranch.deleted : branch.deleted;
    return this._deploymentsRepo.update( { $set: { branches: branches } }, { _id: deploymentId } );
  }
}
