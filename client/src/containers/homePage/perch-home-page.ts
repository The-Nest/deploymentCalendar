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
  public showLoginButton = false;
  constructor(
    private _gitHubService: GitHubService,
    private _activatedRoute: ActivatedRoute
  ) {

    this._activatedRoute.queryParams.subscribe(queryParams => {
      if (!isNullOrUndefined(queryParams['code']) && !isNullOrUndefined(queryParams['state'])) {
        this._gitHubService.completeAuthentication(queryParams['state'], queryParams['code']);
      }
    });
  }

  ngOnInit() {
    this._gitHubService.authenticated.subscribe(authenticated => {
      this.showLoginButton = !authenticated;
    });
  }

  public authenticationURL() {
    return this._gitHubService.generateAuthenticationURL();
  }
}
