import { IGitHubClient, IGraphQLResponse } from '../types/clients/github.client';
import { isNullOrUndefined } from 'util';
import { IRepository } from '../../shared/types/deployment/repository';

export class GitHubService {
  constructor(private _gitHubClient: IGitHubClient) { }

  public getBranch(owner: string, repo: string, branch: string, authToken: string) {
    return this._gitHubClient.restRequest(
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

  public getRepo(owner: string, repo: string, accessToken: string): Promise<IRepository> {
    return this._gitHubClient.graphQLRequest(
      `query {
        repositoryOwner(login: "${owner}") {
          repository(name: "${repo}") {
            name,
            owner {
              login
            }
          }
        }
      }`,
      accessToken
    ).then(response => ({
      name: response.data.repositoryOwner.repository.name,
      owner: response.data.repositoryOwner.repository.owner.login
    } as IRepository));
  }

  public getOwnerType(owner: string, accessToken: string): Promise<string> {
    return this._gitHubClient.graphQLRequest(
      `query {
        repositoryOwner(login: "${owner}") {
          type: __typename
        }
      }`,
      accessToken
    ).then(response => {
      if (isNullOrUndefined(response.data.repositoryOwner)) {
        return null;
      }
      return response.data.repositoryOwner.type;
    });
  }

  public _getRepo(owner: string, repo: string, accessToken: string) {

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
    return this._gitHubClient.graphQLRequest(query, accessToken)
      .then((graphQLResponse: IGraphQLResponse) => {
        if (!isNullOrUndefined(graphQLResponse.errors)) {
          return null;
        }
        return graphQLResponse.data.repositoryOwner.repositories.nodes.map(node => node.name);
      });
  }


// Authentication actions

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
