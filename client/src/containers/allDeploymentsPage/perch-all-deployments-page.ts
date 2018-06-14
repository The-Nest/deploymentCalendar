import { Component } from '@angular/core';
import { LinkHelper } from '../../services/link-helper/link-helper';
import { HttpClient } from '@angular/common/http';
import { IDeploymentSummary } from '../../../../shared/types/deployment/deployment-summary';

@Component({
  selector: 'perch-all-deployments',
  templateUrl: './perch-all-deployments-page.html',
  styleUrls: ['./perch-all-deployments-page.scss']
})

export class PerchAllDeploymentsPage {
  public deploymentSummaries: IDeploymentSummary[] = [];
  constructor(
    private _http: HttpClient,
    private _linkHelper: LinkHelper) { }

  ngOnInit() {
    this._http.get(this._linkHelper.getDeploymentSummaries())
      .subscribe((result: IDeploymentSummary[]) => this.deploymentSummaries = result);
  }
}
