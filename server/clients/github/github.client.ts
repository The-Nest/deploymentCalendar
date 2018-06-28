import * as https from 'https';
import { isUndefined, isNullOrUndefined } from 'util';

import { IGitHubClient, IRestResponse, IGraphQLResponse } from '../../types/clients/github.client';
import { MemoryCache } from './memory-cache';


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

  public async restRequest(method: string, url: string, accessToken: string, body?: any): Promise<IRestResponse> {
    return this._jsonRequest(method, url, accessToken, body).then((apiResponse: IGitHubAPIResponse) => {
      const restResponse: IRestResponse = {
        statusCode: apiResponse.statusCode
      };
      this._isSuccessStatusCode(apiResponse.statusCode) ? restResponse.data = apiResponse.body : restResponse.error = apiResponse.body;
      return restResponse;
    });
  }

  public graphQLRequest(query: string, accessToken: string): Promise<IGraphQLResponse> {
    return this._jsonRequest('POST', '/graphql', accessToken, { query }).then((apiResponse: IGitHubAPIResponse) => {
      const graphQLResponse: IGraphQLResponse = {
        statusCode: apiResponse.statusCode,
        data: apiResponse.body.data,
        errors: apiResponse.body.errors
      };
      return graphQLResponse;
    });
  }

  private async _jsonRequest(
    method: string,
    url: string,
    token: string,
    body?: any): Promise<IGitHubAPIResponse> {
      const options: https.RequestOptions = {
        hostname: 'api.github.com',
        path: url,
        method: method,
        headers: {
          'User-Agent': this._userAgent,
          'Accept': 'application/vnd.github+json',
          'Authorization': `token ${token}`
        }
      };
      return new Promise<IGitHubAPIResponse>((resolve) => {
        const request = https.request(options, (res) => {
          try {
            res.setEncoding('utf8');
            let fullBody = '';
            res.on('data', chunk => fullBody += chunk);
            res.on('end', () => {
              const jsonBody = JSON.parse(fullBody);
              const response: IGitHubAPIResponse = { body: jsonBody, statusCode: res.statusCode };
              resolve(response);
            });
          } catch (err) {
            resolve({ body: err, statusCode: 500 });
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

  public getAuthorizationForToken(clientId: string, clientSecret: string, accessToken: string): Promise<IRestResponse> {
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
            const response: IRestResponse =
              (this._isSuccessStatusCode(res.statusCode) ? { data: jsonBody } : { error: jsonBody }) as IRestResponse;
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

interface IGitHubAPIResponse {
  body: any;
  statusCode: number;
}
