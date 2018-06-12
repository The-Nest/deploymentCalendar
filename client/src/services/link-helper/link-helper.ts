import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

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

  public gitHubAuthorization(clientId: string, state: string): string {
    return `https://github.com/login/oauth/authorize?client_id=${clientId}&state=${state}`;
  }

  public getGitHubAccessToken(code: string, state: string): string {
    return `http://localhost:3001/api/github/access_token?code=${code}&state=${state}`;
  }
}
