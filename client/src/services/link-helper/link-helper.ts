import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class LinkHelper {
  public homeUrl(): string {
    return '/';
  }

  public deploymentCreateUrl(): string {
    return '/deployment/create';
  }

  public privacyUrl(): string {
    return '/privacy';
  }

  public termsOfUseUrl(): string {
    return '/terms-of-use';
  }

  public contactEmailLink(): string {
    return 'mailto:mtlee3@gmail.com';
  }

  public getDeploymentSummaries(): string {
    return 'http://localhost:3001/api/deployments/summaries';
  }
}
