import { IGitHubClient } from '../types/clients/github.client';
import { IRepository } from '../../shared/types/deployment/repository';

export class GitHubService {
  constructor(private _gitHubClient: IGitHubClient) { }

  public getBranch(owner: string, repo: string, branch: string) {
    return this._gitHubClient.jsonInstallationRequest(
      'GET',
      `/repos/${owner}/${repo}/branches/${branch}`,
      owner
    ).then(response => {
      if (response.error) {
        return undefined;
      }
      return response.data;
    });
  }

  public getRepo(owner: string, repo: string) {
    return this._gitHubClient.jsonInstallationRequest(
      'GET',
      `/repos/${owner}/${repo}`,
      owner
    ).then(response => {
      if (response.error) {
        return undefined;
      }
      return response.data;
    });
  }

  public getApplicationInstallations() {
    return this._gitHubClient.jsonApplicationRequest(
      'GET',
      '/app/installations',
    ).then(response => {
      if (response.error) {
        return undefined;
      }
      return response.data;
    });
  }
}
