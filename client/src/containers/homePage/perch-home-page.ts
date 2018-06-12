import { Component } from '@angular/core';
import { LinkHelper } from '../../services/link-helper/link-helper';
import { HttpClient } from '@angular/common/http';
import { IDeploymentSummary } from '../../../../shared/types/deployment/deployment-summary';
import { GitHubService } from '../../services/github/github.service';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'perch-home-page',
  templateUrl: './perch-home-page.html',
  styleUrls: ['./perch-home-page.scss']
})

export class PerchHomePage {
  public deploymentSummaries: IDeploymentSummary[] = [];
  public showLoginButton = false;
  public userName = '';
  public userAvatarUrl = '';
  constructor(
    private _http: HttpClient,
    private _linkHelper: LinkHelper,
    private _gitHubService: GitHubService,
    private _activatedRoute: ActivatedRoute
  ) {
    this._http.get(this._linkHelper.getDeploymentSummaries())
      .subscribe((result: IDeploymentSummary[]) => this.deploymentSummaries = result);

    this._activatedRoute.queryParams.subscribe(queryParams => {
      if (!isNullOrUndefined(queryParams['code']) && !isNullOrUndefined(queryParams['state'])) {
        this._gitHubService.completeAuthentication(queryParams['state'], queryParams['code']);
      }
    });
  }

  ngOnInit() {
    this._gitHubService.authenticated.subscribe(authenticated => {
      this.showLoginButton = !authenticated;
      if (authenticated) {
        this._http.get(
          'https://api.github.com/user',
          {
            headers: {
              'Authorization': `token ${localStorage.getItem('gh:token')}`
            }
          }
        ).subscribe((res: any) => {
          this.userName = res.name;
          this.userAvatarUrl = res.avatar_url;
        });
      }
    });
  }

  public authenticationURL() {
    return this._gitHubService.generateAuthenticationURL();
  }
}
