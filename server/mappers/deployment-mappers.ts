import { ObjectID } from 'mongodb';

import { IGitHubClient } from '../types/clients/github.client';
import { IDeploymentPayload } from '../../shared/types/deployment/payloads/deployment';
import { IDeployment } from '../../shared/types/deployment/deployment';
import { IDeploymentMember } from '../../shared/types/deployment/member';
import { IBranch } from '../../shared/types/deployment/branch';
import { isNullOrUndefined } from 'util';
import { GitHubService } from 'services/github.service';

export async function mapDeploymentPayloadToDocument(
  body: IDeploymentPayload,
  gitHubClient: IGitHubClient,
  gitHubService: GitHubService,
  accessToken: string): Promise<IDeployment> {
  return {
    name: _validateName(body.name),
    repo: await gitHubService.getRepo(body.repo.owner, body.repo.name, accessToken),
    team: await gitHubClient.getTeam(body.teamId),
    dateTime: _validateDateTime(body.dateTime)
  } as IDeployment;
}

function _validateName(name: string) {
  if (!isNullOrUndefined(name) && name.length > 0) {
    return name;
  }
  throw new Error('Invalid name');
}

function _validateDateTime(dateTime: Date) {
  if (!isNullOrUndefined(dateTime)) {
    return dateTime;
  }
  throw new Error('Invalid date');
}
