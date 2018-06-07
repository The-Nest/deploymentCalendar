import * as https from 'https';

import { PullRequestStatus } from '../../../shared/enums/deployment/pull-request-status';
import { MockMembers } from '../../../shared/mock/members/members';
import { IGitHubClient, IGitHubResponse } from 'types/clients/github.client';
import { IRepository } from '../../../shared/types/deployment/repository';
import { IncomingMessage } from 'http';

export class GitHubClient implements IGitHubClient {
  constructor(private _userAgent: string) { }
  public async getTeam(teamId: number) {
    if (teamId === 1) {
      return {
        name: 'Eagle',
        id: 1
      };
    }
    throw new Error('Team not found');
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

  public jsonRequest(
    method: string,
    url: string,
    token: string,
    body?: any,
    acceptHeader = 'application/vnd.github.v3+json'): Promise<IGitHubResponse> {
      const options: https.RequestOptions = {
        hostname: 'api.github.com',
        path: url,
        method: method,
        headers: {
          'User-Agent': this._userAgent,
          'Accept': acceptHeader,
          'Authorization': `token ${token}`
        }
      };
      return new Promise<IGitHubResponse>((resolve) => {
        const request = https.request(options, (res) => {
          try {
            res.setEncoding('utf8');
            let fullBody = '';
            res.on('data', chunk => fullBody += chunk);
            res.on('end', () => {
              const jsonBody = JSON.parse(fullBody);
              const response: IGitHubResponse =
                (this._isSuccessStatusCode(res.statusCode) ? { data: jsonBody } : { error: jsonBody }) as IGitHubResponse;
              response.statusCode = res.statusCode;
              resolve(response);
            });
          } catch (err) {
            resolve({
              statusCode: 500,
              error: err
            } as IGitHubResponse);
          }
        });
        request.end();
      });
  }

  private _isSuccessStatusCode(statusCode: number) {
    return (statusCode >= 200) && (statusCode <= 299);
  }
}
