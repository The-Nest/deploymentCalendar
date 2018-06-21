import { Component } from '@angular/core';
import { LinkHelper } from '../../services/link-helper/link-helper';
import { HttpClient } from '@angular/common/http';
import { IDeploymentSummary } from '../../../../shared/types/deployment/deployment-summary';
import { GitHubService } from '../../services/github/github.service';
import { isNullOrUndefined } from 'util';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'perch-all-deployments',
  templateUrl: './perch-all-deployments-page.html',
  styleUrls: ['./perch-all-deployments-page.scss']
})

export class PerchAllDeploymentsPage {
  public deploymentSummaries: IDeploymentSummary[] = [];
  constructor(
    private _http: HttpClient,
    private _gitHubService: GitHubService,
    private _linkHelper: LinkHelper) { }

  ngOnInit() {
    this._gitHubService.user.pipe(
      filter((value, index) => !isNullOrUndefined(value))
    ).subscribe(user => {
      this._http.get(
        this._linkHelper.getDeploymentSummaries(user.login.login),
        {
          headers: {
            'Authorization': this._gitHubService.token
          }
        }
      ).subscribe((result: IDeploymentSummary[]) => this.deploymentSummaries = result);
    });
  }
}
