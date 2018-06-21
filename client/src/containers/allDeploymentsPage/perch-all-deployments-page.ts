import { Component } from '@angular/core';
import { LinkHelper } from '../../services/link-helper/link-helper';
import { HttpClient } from '@angular/common/http';
import { IDeploymentSummary } from '../../../../shared/types/deployment/deployment-summary';
import { GitHubService } from '../../services/github/github.service';
import { isNullOrUndefined } from 'util';
import { filter } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'perch-all-deployments',
  templateUrl: './perch-all-deployments-page.html',
  styleUrls: ['./perch-all-deployments-page.scss']
})

export class PerchAllDeploymentsPage {
  public deploymentSummaries: IDeploymentSummary[] = [];
  public isUserRoute = true;
  public login = '';

  constructor(
    private _http: HttpClient,
    private _gitHubService: GitHubService,
    private _linkHelper: LinkHelper,
    private _route: ActivatedRoute) {
      this.isUserRoute = isNullOrUndefined(this._route.snapshot.params['login']);
      if (!this.isUserRoute) {
        this.login = this._route.snapshot.params['login'];
      }
    }

  ngOnInit() {
    this._gitHubService.user.pipe(
      filter((value, index) => !isNullOrUndefined(value))
    ).subscribe(user => {
      if (this.isUserRoute) {
        this.login = user.login.login;
      }
      this._http.get(
        this._linkHelper.getDeploymentSummaries(this.login),
        {
          headers: {
            'Authorization': this._gitHubService.token
          }
        }
      ).subscribe((result: IDeploymentSummary[]) => this.deploymentSummaries = result);
    });
  }
}
