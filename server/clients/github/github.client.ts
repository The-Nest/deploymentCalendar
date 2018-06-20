import * as https from 'https';
import { isUndefined, isNullOrUndefined } from 'util';

import { IGitHubClient, IGitHubResponse } from '../../types/clients/github.client';
import { MemoryCache } from './memory-cache';


export class GitHubClient implements IGitHubClient {
  private _installationIdCache = new MemoryCache<number>();
  private _installationAccessTokenCache = new MemoryCache<string>();

  constructor(private _userAgent: string, private _key: string | Buffer, private _id: number) { }

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

  public async jsonUserRequest(method: string, url: string, accessToken: string, body?: any): Promise<IGitHubResponse> {
    return this._jsonRequest(method, url, gitHubApiRequestType.User, accessToken, body);
  }

  public graphQlRequest(query: string, accessToken: string): Promise<IGitHubResponse> {
    return this._jsonRequest('POST', '/graphql', gitHubApiRequestType.Applicaton, accessToken, { query });
  }

  private async _jsonRequest(
    method: string,
    url: string,
    requestType: gitHubApiRequestType,
    token: string,
    body?: any): Promise<IGitHubResponse> {
      const options: https.RequestOptions = {
        hostname: 'api.github.com',
        path: url,
        method: method,
        headers: {
          'User-Agent': this._userAgent,
          'Accept': requestType === gitHubApiRequestType.Applicaton ?
            'application/vnd.github.machine-man-preview+json' : 'application/vnd.github+json',
          'Authorization': requestType === gitHubApiRequestType.Applicaton ? `Bearer ${token}` : `token ${token}`
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
        if (!isNullOrUndefined(body)) {
          request.write(JSON.stringify(body));
        }
        request.end();
      });
  }

  public getAccessToken(clientId: string, clientSecret: string, code: string, state: string): Promise<any> {
    const postBody = JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      state: state
    });
    const options: https.RequestOptions = {
      hostname: 'github.com',
      path: '/login/oauth/access_token',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': postBody.length
      }
    };
    return new Promise((resolve) => {
      const request = https.request(options, (res) => {
        res.setEncoding('utf8');
              let fullBody = '';
              res.on('data', chunk => fullBody += chunk);
              res.on('end', () => {
                const jsonBody = JSON.parse(fullBody);
                resolve({ token: jsonBody.access_token });
              });
      });
      request.write(postBody);
      request.end();
    });
  }

  public getAuthorizationForToken(clientId: string, clientSecret: string, accessToken: string): Promise<IGitHubResponse> {
    const urlPath = `/applications/${clientId}/tokens/${accessToken}`;
    const encodedAuth = new Buffer(`${clientId}:${clientSecret}`).toString('base64');
    const options: https.RequestOptions = {
      hostname: 'api.github.com',
      path: urlPath,
      method: 'GET',
      headers: {
        'User-Agent': this._userAgent,
        'Accept': 'application/json',
        'Authorization': `Basic ${encodedAuth}`
      }
    };
    return new Promise((resolve) => {
      const request = https.request(options, (res) => {
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
      });
      request.end();
    });
  }



  private _isSuccessStatusCode(statusCode: number) {
    return (statusCode >= 200) && (statusCode <= 299);
  }
}

enum gitHubApiRequestType {
  User,
  Applicaton,
  Installation
}
