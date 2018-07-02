import { isNullOrUndefined } from 'util';
import { ObjectID } from 'mongodb';

import { IDeploymentsRepository } from 'types/repositories/deployments.repository';
import { IGitHubClient } from 'types/clients/github.client';
import { IBranchPayload } from '../../shared/types/deployment/payloads/branch';
import { IBranch } from '../../shared/types/deployment/branch';

export class IntegrationBranchService {
  constructor(
    private _deploymentsRepo: IDeploymentsRepository,
    private _gitHubClient: IGitHubClient
  ) { }

  public async addIntegrationBranch(deploymentId: ObjectID, branch: IBranchPayload) {
    const { repo } = await this._deploymentsRepo.find(
      { _id: deploymentId },
      { projection: {
        repo: true
      }
    });
    const branchData = await this._gitHubClient.getBranch(repo.owner, repo.name, branch.name);
    const mappedBranch = {
      name: branchData.name,
      deleted: false
    } as IBranch;
    return this._deploymentsRepo.update(
      { $set: { integrationBranch: mappedBranch } },
      { _id: deploymentId }
    );
  }

  public removeIntegrationBranch(deploymentId: ObjectID) {
    return this._deploymentsRepo.update( { $unset: { integrationBranch: null } } );
  }

  public async updateIntegrationBranch(deploymentId: ObjectID, branch: IBranchPayload) {
    const patch = {};
    if (!isNullOrUndefined(branch.deleted)) {
      patch['integrationBranch.deleted'] = branch.deleted;
    }
    return this._deploymentsRepo.update(
      { $set: patch },
      { _id: deploymentId }
    );
  }
}
