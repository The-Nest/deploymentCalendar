export interface IGitHubClient {
  getTeam(teamId: number);
  getBranch(owner: string, repo: string, branch: string);
  jsonRequest(
    method: string,
    url: string,
    authOptions: IGitHubAuthenticationOptions,
    body?: any): Promise<IGitHubResponse>;
}

export interface IGitHubResponse {
  data?: any;
  error?: any;
  statusCode: number;
}

export interface IGitHubAuthenticationOptions {
  authenticationType: GitHubAuthenticationType;
  installationId?: number;
}

export enum GitHubAuthenticationType {
  App,
  Installation
}
