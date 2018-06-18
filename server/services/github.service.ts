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
    ).then(response => response.data);
  }

  public checkMembership(organization: string, username: string, accessToken: string) {
    return this._gitHubClient.jsonUserRequest(
      'GET',
      `/orgs/${organization}/members/${username}`,
      accessToken
    ).then(response => {
      console.log(response);
      return response.statusCode !== 404;
    });
  }

  public getApplicationInstallations() {
    return this._gitHubClient.jsonApplicationRequest(
      'GET',
      '/app/installations',
    ).then(response => response.data);
  }

  public getAuthenticatedUser(accessToken: string) {
    return this._gitHubClient.jsonUserRequest(
      'GET',
      '/user',
      accessToken
    ).then(response => response.data);
  }

  public getAccessToken(code: string, state: string) {
    return this._gitHubClient.getAccessToken(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      code,
      state
    );
  }

  public getOrganizationInstallation(organization: string) {
    return this._gitHubClient.jsonApplicationRequest(
      'GET',
      `/orgs/${organization}/installation`
    ).then(response => response.data);
  }

  public getUserInstallation(user: string) {
    return this._gitHubClient.jsonApplicationRequest(
      'GET',
      `/users/${user}/installation`
    ).then(response => response.data);
  }

  public validateAccessToken(token: string) {
    return this.getAuthorizationForToken(token).then(res => {
      if (res.statusCode === 404) {
        return false;
      }
      return true;
    });
  }

  public getAuthorizationForToken(token: string) {
    return this._gitHubClient.getAuthorizationForToken(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      token
    );
  }
}
