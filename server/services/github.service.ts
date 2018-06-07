import { IGitHubClient } from 'types/clients/github.client';
import { IRepository } from '../../shared/types/deployment/repository';

export class GitHubService {
  constructor(private _gitHubClient: IGitHubClient) { }

  public getBranch(owner: string, repo: string, branch: string) {
    return this._gitHubClient.jsonRequest(
      'GET',
      `/repos/${owner}/${repo}/branches/${branch}`,
      'not-a-token'
    ).then(response => {
      if (response.error) {
        return undefined;
      }
      return response.data;
    });
  }

  public getRepo(owner: string, repo: string) {
    return this._gitHubClient.jsonRequest(
      'GET',
      `/repos/${owner}/${repo}`,
      'not-a-token'
    ).then(response => {
      console.log(response);
      if (response.error) {
        return undefined;
      }
      return response.data;
    });
  }
}
