export interface IGitHubClient {
  getTeam(teamId: number);
  getBranch(owner: string, repo: string, branch: string);

  jsonApplicationRequest(method: string, url: string, body?: any): Promise<IGitHubResponse>;
  jsonInstallationRequest(method: string, url: string, installationOwner: string, body?: any): Promise<IGitHubResponse>;
}

export interface IGitHubResponse {
  data?: any;
  error?: any;
  statusCode: number;
}
