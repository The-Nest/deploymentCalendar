export interface IGitHubClient {
  getTeam(teamId: number);
  getBranch(owner: string, repo: string, branch: string);

  jsonUserRequest(method: string, url: string, accessToken: string, body?: any): Promise<IGitHubResponse>;

  graphQlRequest(query: string, accessToken: string): Promise<IGitHubResponse>;

  getAccessToken(clientId: string, clientSecret: string, code: string, state: string): Promise<any>;
  getAuthorizationForToken(clientId: string, clientSecret: string, accessToken: string): Promise<IGitHubResponse>;
}

export interface IGitHubResponse {
  data?: any;
  error?: any;
  statusCode: number;
}
