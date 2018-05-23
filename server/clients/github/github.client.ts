import { PullRequestStatus } from '../../../shared/enums/deployment/pull-request-status';
import { MockMembers } from '../../../shared/mock/members/members';
import { IGitHubClient } from 'types/clients/github.client';
import { IRepository } from '../../../shared/types/deployment/repository';

export class GitHubClient implements IGitHubClient {
  public async getTeam(teamId: number) {
    if (teamId === 1) {
      return {
        name: 'Eagle',
        id: 1
      };
    }
    throw new Error('Team not found');
  }

  public async getRepo(owner: string, repo: string): Promise<IRepository> {
    if (owner === 'the-nest' && repo === 'spizaetus') {
      return {
        name: repo,
        owner: owner
      } as IRepository;
    }
    throw new Error('Repository not found');
  }

  public async getBranch(owner: string, repo: string, branch: string) {
    if (owner === 'the-nest' && repo === 'spizaetus') {
      return {
        owner: owner,
        repo: repo,
        name: branch
      };
    }
    throw new Error('Branch not found');
  }
}
