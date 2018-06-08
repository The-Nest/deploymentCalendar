import * as https from 'https';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';
import { isUndefined } from 'util';

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

  public async jsonApplicationRequest(method: string, url: string, body?: any): Promise<IGitHubResponse> {
    const token = this._getJwtToken();
    return this._jsonRequest(method, url, true, token, body);
  }
  public async jsonInstallationRequest(method: string, url: string, installationOwner: string, body?: any): Promise<IGitHubResponse> {
    const jwtToken = this._getJwtToken();
    const installationId = await this._getInstallationIdForOwner(installationOwner, jwtToken);
    const token = await this._getInstallationAccessToken(installationId, jwtToken);
    return this._jsonRequest(method, url, false, token, body);
  }

  private async _jsonRequest(
    method: string,
    url: string,
    applicationRequest: boolean,
    token: string,
    body?: any): Promise<IGitHubResponse> {
      const options: https.RequestOptions = {
        hostname: 'api.github.com',
        path: url,
        method: method,
        headers: {
          'User-Agent': this._userAgent,
          'Accept': applicationRequest ? 'application/vnd.github.machine-man-preview+json' : 'application/vnd.github+json',
          'Authorization': applicationRequest ? `Bearer ${token}` : `token ${token}`
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

  private _getJwtToken(): string {
    const issueSeconds = Math.floor(Date.now() / 1000);
    const expirySeconds = issueSeconds + 60;
    const payload = {
      iat: issueSeconds,
      exp: expirySeconds,
      iss: this._id
    };
    return jwt.sign(payload, this._key, { algorithm: 'RS256' });
  }

  private _getInstallationAccessToken(installationId: number, token: string): Promise<string> {
    const options: https.RequestOptions = {
      hostname: 'api.github.com',
      path: `/installations/${installationId}/access_tokens`,
      method: 'POST',
      headers: {
        'User-Agent': this._userAgent,
        'Accept': 'application/vnd.github.machine-man-preview+json',
        'Authorization': `Bearer ${token}`
      }
    };
    return new Promise<string>((resolve) => {
      const tokenRequest = https.request(options, (res: IncomingMessage) => {
        res.setEncoding('utf8');
        let fullBody = '';
        res.on('data', chunk => fullBody += chunk);
        res.on('end', () => resolve(JSON.parse(fullBody).token));
      });
      tokenRequest.end();
    });
  }

  private _getInstallationIdForOwner(owner: string, token: string): Promise<number> {
    const options: https.RequestOptions = {
      hostname: 'api.github.com',
      path: `/app/installations`,
      method: 'GET',
      headers: {
        'User-Agent': this._userAgent,
        'Accept': 'application/vnd.github.machine-man-preview+json',
        'Authorization': `Bearer ${token}`
      }
    };
    return new Promise<number>((resolve) => {
      const tokenRequest = https.request(options, (res: IncomingMessage) => {
        res.setEncoding('utf8');
        let fullBody = '';
        res.on('data', chunk => fullBody += chunk);
        res.on('end', () => {
          const jsonBody = JSON.parse(fullBody);
          const match = jsonBody.find(installation => installation.account.login === owner);
          resolve(match.id);
        });
      });
      tokenRequest.end();
    });
  }
}
