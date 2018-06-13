import { Injectable } from '@angular/core';
import { GitHubService } from '../services/github/github.service';
import { CanActivate } from '@angular/router';

@Injectable()
export class GitHubAuthenticationGuard implements CanActivate {
  private _authenticated = false;
  constructor(private _gitHubService: GitHubService) { }

  canActivate() {
    this._gitHubService.getUserData();
    return true;
  }
}
