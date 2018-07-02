import { IDeploymentPayload } from '../../shared/types/deployment/payloads/deployment';
import { IDeployment } from '../../shared/types/deployment/deployment';
import { isNullOrUndefined } from 'util';
import { GitHubService } from 'services/github.service';

export async function mapDeploymentPayloadToDocument(
  body: IDeploymentPayload,
  gitHubService: GitHubService,
  accessToken: string): Promise<IDeployment> {
  return {
    name: _validateName(body.name),
    repo: await gitHubService.getRepo(body.repo.owner, body.repo.name, accessToken),
    team: await gitHubService.getTeam(body.teamId, accessToken),
    owner: body.owner,
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
