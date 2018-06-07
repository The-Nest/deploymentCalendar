export interface IGitHubClient {
  getTeam(teamId: number);
  getBranch(owner: string, repo: string, branch: string);
  jsonRequest(method: string, url: string, token: string, body?: any): Promise<IGitHubResponse>;
}

export interface IGitHubResponse {
  data?: any;
  error?: any;
  statusCode: number;
}
