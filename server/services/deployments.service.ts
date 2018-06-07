import { ObjectID } from 'mongodb';

import { IDeploymentPayload } from '../../shared/types/deployment/payloads/deployment';
import { BranchesService } from './branches.service';
import { IGitHubClient } from 'types/clients/github.client';
import { IDeploymentsRepository } from '../types/repositories/deployments.repository';
import { mapDeploymentPayloadToDocument } from '../mappers/deployment-mappers';
import { IMembersRepository } from 'types/repositories/members.repository';
import { IDeployment } from '../../shared/types/deployment/deployment';
import { IntegrationBranchService } from './integration-branch.service';
import { isNullOrUndefined } from 'util';
import { QAService } from './qa.service';
import { GitHubService } from './github.service';

export class DeploymentsService {
  public branches: BranchesService;
  public integrationBranch: IntegrationBranchService;
  public qa: QAService;

  constructor (
    private _deploymentsRepository: IDeploymentsRepository,
    private _membersRepository: IMembersRepository,
    private _gitHubClient: IGitHubClient,
    private _gitHubService: GitHubService) {
    this.branches = new BranchesService(_deploymentsRepository, _gitHubClient);
    this.integrationBranch = new IntegrationBranchService(_deploymentsRepository, _gitHubClient);
    this.qa = new QAService(_deploymentsRepository, _membersRepository);
  }

  public async addDeployment(deployment: IDeploymentPayload) {
    const mappedDeployment =
      await mapDeploymentPayloadToDocument(deployment, this._gitHubClient, this._gitHubService, this._membersRepository);
    return this._deploymentsRepository.insert(mappedDeployment).then(id => id);
  }

  public getSummaries() {
    return this._deploymentsRepository.filter(
      { },
      {
        projection: {
          name: true,
          dateTime: true,
          owner: true,
          team: true
        }
      }
    );
  }

  public getDeployments() {
    return this._deploymentsRepository.filter();
  }

  public getDeployment(deploymentId: ObjectID) {
    return this._deploymentsRepository.find({ _id: deploymentId });
  }

  public deleteDeployment(deploymentId: ObjectID) {
    return this._deploymentsRepository.delete({ _id: deploymentId });
  }

  public async setOwner(deploymentId: ObjectID, ownerMemberId: ObjectID) {
    const owner = await this._membersRepository.find({ _id: ownerMemberId });
    return this._deploymentsRepository.update(
      { $set: { owner: owner } },
      { _id: deploymentId }
    );
  }

  public removeOwner(deploymentId: ObjectID) {
    return this._deploymentsRepository.update(
      { $unset: { owner: null } },
      { _id: deploymentId }
    );
  }

  public updateDeployment(deploymentId: ObjectID, deployment: IDeploymentPayload) {
    const patch = {};
    if (!isNullOrUndefined(deployment.name) && deployment.name.length > 0) {
      patch['name'] = deployment.name;
    }
    if (!isNullOrUndefined(deployment.teamId)) {
      patch['team'] = this._gitHubClient.getTeam(deployment.teamId);
    }
    if (!isNullOrUndefined(deployment.dateTime)) {
      patch['dateTime'] = deployment.dateTime;
    }
    return this._deploymentsRepository.update({ $set: patch });
  }
}
