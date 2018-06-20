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

  public getScope(login: string, accessToken: string) {
    this._gitHubClient.graphQlRequest(
      `
      query {
        viewer {
          public: repositories(affiliations: [COLLABORATOR, OWNER], first: 50, privacy: PUBLIC) {
            nodes {
              name,
              isPrivate
            }
          },
          private: repositories(affiliations: [COLLABORATOR, OWNER], first: 50, privacy: PRIVATE) {
            nodes {
              name,
              isPrivate
            }
          }
        }
      }
      `,
      accessToken
    ).then(response => {
      console.log(JSON.stringify(response));
      return response;
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

  isAppInstalled(login: string) {
    return this._gitHubClient.jsonApplicationRequest(
      'GET',
      `/users/${login}/installation`
    ).then(res => res.statusCode === 200);
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
