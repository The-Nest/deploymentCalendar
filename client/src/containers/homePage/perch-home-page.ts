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
    private _gitHubService: GitHubService
  ) { }

  ngOnInit() {
    this._gitHubService.authenticated.subscribe(authenticated => {
      this.showLoginButton = !authenticated;
    });
  }

  public authenticationURL() {
    return this._gitHubService.generateAuthenticationURL();
  }
}
