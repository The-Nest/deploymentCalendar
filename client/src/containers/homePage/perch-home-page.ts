import { Component } from '@angular/core';
import { LinkHelper } from '../../services/link-helper/link-helper';
import { HttpClient } from '@angular/common/http';
import { IDeploymentSummary } from '../../../../shared/types/deployment/deployment-summary';
import { GitHubService } from '../../services/github/github.service';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { GitHubScopes } from '../../enums/github-scopes';

@Component({
  selector: 'perch-home-page',
  templateUrl: './perch-home-page.html',
  styleUrls: ['./perch-home-page.scss']
})

export class PerchHomePage {
  public showLoginButton = false;

  constructor(
    private _gitHubService: GitHubService
  ) { }

  ngOnInit() {
    this._gitHubService.authenticated.subscribe(authenticated => {
      this.showLoginButton = !authenticated;
    });
  }

  public authenticationURL() {
    return this._gitHubService.generateAuthenticationURL([
      GitHubScopes.USER,
      GitHubScopes.REPO,
      GitHubScopes.READ_ORG
    ]);
  }
}
