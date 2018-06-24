import { IGitHubClient } from '../types/clients/github.client';
import { IRepository } from '../../shared/types/deployment/repository';
import { isNullOrUndefined } from 'util';

export class GitHubService {
  constructor(private _gitHubClient: IGitHubClient) { }

  public getBranch(owner: string, repo: string, branch: string, authToken: string) {
    return this._gitHubClient.jsonUserRequest(
      'GET',
      `/repos/${owner}/${repo}/branches/${branch}`,
      authToken
    ).then(response => {
      if (response.error) {
        return undefined;
      }
      return response.data;
    });
  }

  public getRepo(owner: string, repo: string, authToken: string) {
    return this._gitHubClient.jsonUserRequest(
      'GET',
      `/repos/${owner}/${repo}`,
      authToken,
    ).then(response => response.data);
  }

  public getRepos(accessToken: string, owner?: string): Promise<string[]> {
    let query = `query {
      viewer {
        repositories(first: 100) {
          pageInfo {
            hasNextPage
          }
          nodes{
            name
          }
        }
      }
    }`;
    if (!isNullOrUndefined(owner)) {
      query = `query {
        repositoryOwner(login: "${owner}") {
          repositories(first: 100) {
            pageInfo {
              hasNextPage
            }
            nodes{
              name
            }
          }
        }
      }`;
    }
    // TODO: handle when an organization has not enabled 3rd party access
    return this._gitHubClient.graphQlRequest(query, accessToken)
      .then(res => res.data.data.repositoryOwner.repositories.nodes.map(node => node.name));
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
      return response;
    });
  }

  public getAccessToken(code: string, state: string) {
    return this._gitHubClient.getAccessToken(
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET,
      code,
      state
    );
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
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET,
      token
    );
  }
}
