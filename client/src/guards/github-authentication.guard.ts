import { Injectable } from '@angular/core';
import { GitHubService, LoginState } from '../services/github/github.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { Location } from '@angular/common';

@Injectable()
export class GitHubAuthenticationGuard implements CanActivate {
  private _authenticated = false;
  constructor(private _gitHubService: GitHubService, private _location: Location, private _router: Router) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // get an access token if we're hitting the route off a redirect from GitHub:
    // TODO: handle expired codes (backend responsibility)
    if (!isNullOrUndefined(route.queryParams['code']) && !isNullOrUndefined(route.queryParams['state'])) {
      try {
        await this._gitHubService.completeAuthentication(route.queryParams['state'], route.queryParams['code']);
      } catch (err) {
        return false;
      }
      // clear out query params
      let path = route.url.join('/');
      this._router.navigate([path], { queryParams: {} });
      return true;
    }

    return this._gitHubService.login().then(loginResult => {
      if (loginResult.state === LoginState.BAD_TOKEN) {
        window.location.href = this._gitHubService.generateAuthenticationURL(window.location.href);
        return false;
      }
      if (loginResult.state === LoginState.SUCCESS) {
        return true;
      }
      return false;
    });
  }
}
