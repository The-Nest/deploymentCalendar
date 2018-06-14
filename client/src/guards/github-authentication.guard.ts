import { Injectable } from '@angular/core';
import { GitHubService } from '../services/github/github.service';
import { CanActivate, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable()
export class GitHubAuthenticationGuard implements CanActivate {
  private _authenticated = false;
  constructor(private _gitHubService: GitHubService, private _router: Router) { }

  canActivate() {
    return this._gitHubService.getUserData().pipe(map(
      (res) => {
        if(!res) {
          this._gitHubService.logout();
          return false;
        }
        return true;
      }
    ));
  }
}
