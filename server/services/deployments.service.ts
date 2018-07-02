import { ObjectID } from 'mongodb';

import { IDeploymentPayload } from '../../shared/types/deployment/payloads/deployment';
import { BranchesService } from './branches.service';
import { IGitHubClient } from 'types/clients/github.client';
import { IDeploymentsRepository } from '../types/repositories/deployments.repository';
import { mapDeploymentPayloadToDocument } from '../mappers/deployment-mappers';
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
    private _gitHubService: GitHubService) {
    this.branches = new BranchesService(_deploymentsRepository, _gitHubService);
    this.integrationBranch = new IntegrationBranchService(_deploymentsRepository, _gitHubService);
    this.qa = new QAService(_deploymentsRepository, _gitHubService);
  }

  public async addDeployment(deployment: IDeploymentPayload, accessToken: string) {
    const mappedDeployment =
      await mapDeploymentPayloadToDocument(deployment, this._gitHubService, accessToken);
    return this._deploymentsRepository.insert(mappedDeployment).then(id => id);
  }

  public async getSummaries(accessToken: string, owner: string) {
    const filter = { };
    const repos = await this._gitHubService.getRepos(accessToken, owner);
    if (isNullOrUndefined(repos)) {
      return repos;
    }
    filter['repo.name'] = { $in: repos };
    return this._deploymentsRepository.filter(
      filter,
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

  public getDeployment(deploymentId: ObjectID) {
    return this._deploymentsRepository.find({ _id: deploymentId });
  }

  public deleteDeployment(deploymentId: ObjectID) {
    return this._deploymentsRepository.delete({ _id: deploymentId });
  }

  public updateDeployment(deploymentId: ObjectID, deployment: IDeploymentPayload, accessToken: string) {
    const patch = {};
    if (!isNullOrUndefined(deployment.name) && deployment.name.length > 0) {
      patch['name'] = deployment.name;
    }
    if (!isNullOrUndefined(deployment.teamId)) {
      patch['team'] = this._gitHubService.getTeam(deployment.teamId, accessToken);
    }
    if (!isNullOrUndefined(deployment.dateTime)) {
      patch['dateTime'] = deployment.dateTime;
    }
    if (!isNullOrUndefined(deployment.owner)) {
      patch['owner'] = deployment.owner;
    }
    return this._deploymentsRepository.update({ $set: patch });
  }
}
