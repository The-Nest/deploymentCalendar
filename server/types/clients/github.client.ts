export interface IGitHubClient {
  getRepo(owner: string, repo: string);
  getTeam(teamId: number);
  getBranch(owner: string, repo: string, branch: string);
}
