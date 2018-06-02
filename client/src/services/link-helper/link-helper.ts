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
}
