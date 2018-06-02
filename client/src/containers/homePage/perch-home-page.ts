import { Component } from '@angular/core';
import { LinkHelper } from '../../services/link-helper/link-helper';
import { HttpClient } from '@angular/common/http';
import { IDeploymentSummary } from '../../../../shared/types/deployment/deployment-summary';

@Component({
  selector: 'perch-home-page',
  templateUrl: './perch-home-page.html',
  styleUrls: ['./perch-home-page.scss']
})

export class PerchHomePage {
  public deploymentSummaries: IDeploymentSummary[] = [];
  constructor(private _http: HttpClient, private _linkHelper: LinkHelper) {
    this._http.get(this._linkHelper.getDeploymentSummaries())
      .subscribe((result: IDeploymentSummary[]) => this.deploymentSummaries = result);
  }
}
