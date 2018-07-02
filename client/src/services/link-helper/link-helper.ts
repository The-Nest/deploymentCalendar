import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { isUndefined } from 'util';
import { GitHubScopes } from '../../enums/github-scopes';

@Injectable()
export class LinkHelper {
  public homeUrl(): string {
    return '/';
  }

  public deploymentCreate(): string {
    return '/deployment/create';
  }

  public getDeploymentSummaries(login: string): string {
    return `http://localhost:3001/api/deployments/${login}/summaries`;
  }

  public login(): string {
    return 'http://localhost:3001/api/login'
  }

  public gitHubAuthorization(clientId: string, state: string, scopes: GitHubScopes[] = [], redirectUri?: string): string {
    let scopeQueryParam = '';
    if (scopes.length > 0) {
      scopeQueryParam = '&scope=' + encodeURI(scopes.reduce((queryParamValue, scope) => queryParamValue += (queryParamValue === '' ? scope : ` ${scope}`), ''));
    }
    if (isUndefined(redirectUri)) {
      return `https://github.com/login/oauth/authorize?client_id=${clientId}&state=${state}${scopeQueryParam}`;
    }
    return `https://github.com/login/oauth/authorize?client_id=${clientId}&state=${state}${scopeQueryParam}&redirect_uri=${redirectUri}`;
  }

  public getGitHubAccessToken(code: string, state: string): string {
    return `http://localhost:3001/api/login/oauth?code=${code}&state=${state}`;
  }
}
