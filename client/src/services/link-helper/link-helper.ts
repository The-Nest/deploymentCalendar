import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { isUndefined } from 'util';

@Injectable()
export class LinkHelper {
  public homeUrl(): string {
    return '/';
  }

  public deploymentCreate(): string {
    return '/deployment/create';
  }

  public getDeploymentSummaries(): string {
    return 'http://localhost:3001/api/deployments/summaries';
  }

  public login(): string {
    return 'http://localhost:3001/api/authentication/login'
  }

  public gitHubAuthorization(clientId: string, state: string, redirectUri?: string): string {
    if (isUndefined(redirectUri)) {
      return `https://github.com/login/oauth/authorize?client_id=${clientId}&state=${state}`;
    }
    return `https://github.com/login/oauth/authorize?client_id=${clientId}&state=${state}&redirect_uri=${redirectUri}`;
  }

  public getGitHubAccessToken(code: string, state: string): string {
    return `http://localhost:3001/api/authentication/access_token?code=${code}&state=${state}`;
  }
}
