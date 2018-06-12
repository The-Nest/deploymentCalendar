import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LinkHelper } from '../link-helper/link-helper';
import { isNullOrUndefined } from 'util';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GitHubService {
  private _state: string = localStorage.getItem('gh:state');
  private _token: string = '';
  public authenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this._isAuthenticated());
  constructor(private _router: Router, private _linkHelper: LinkHelper, private _http: HttpClient) { }

  public generateAuthenticationURL() {
    if (isNullOrUndefined(this._state)) {
      this._state = localStorage.getItem('gh:state');
      if (isNullOrUndefined(this._state)) {
        this._state = 'abc123';
        localStorage.setItem('gh:state', this._state);
      }
    }
    return this._linkHelper.gitHubAuthorization('Iv1.0047e1810d2de496', this._state);
  }

  public completeAuthentication(state: string, code: string) {
    this._http.get(
      this._linkHelper.getGitHubAccessToken(code, state)
    ).subscribe((responseToken: any) => {
      if (!isNullOrUndefined(responseToken.token)) {
        this._token = responseToken.token;
        localStorage.setItem('gh:token', this._token);
        this.authenticated.next(true);
      }
    });
  }

  private _isAuthenticated() {
    return !isNullOrUndefined(localStorage.getItem('gh:token'));
  }
}
