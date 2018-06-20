import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LinkHelper } from '../link-helper/link-helper';
import { isNullOrUndefined } from 'util';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { GitHubScopes } from '../../enums/github-scopes';

@Injectable()
export class GitHubService {
  private _state: string = localStorage.getItem('gh:state');
  public token: string = localStorage.getItem('gh:token');
  public authenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this._isAuthenticated());
  public user: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private _router: Router, private _linkHelper: LinkHelper, private _http: HttpClient) { }

  public generateAuthenticationURL(scopes: GitHubScopes[] = [], redirectUri?: string) {
    if (isNullOrUndefined(this._state)) {
      this._state = localStorage.getItem('gh:state');
      if (isNullOrUndefined(this._state)) {
        this._state = 'abc123';
        localStorage.setItem('gh:state', this._state);
      }
    }
    return this._linkHelper.gitHubAuthorization('85b93559560fd5e506b9', this._state, scopes, redirectUri);
  }

  public logout() {
   localStorage.removeItem('gh:token');
   this.authenticated.next(false);
   this._router.navigate(['/']);
  }

  public login(): Promise<LoginResult> {
    return new Promise((resolve) => {
      if (isNullOrUndefined(this.token)) {
        resolve({
          state: LoginState.BAD_TOKEN
        });
        return;
      }
      this._http.get(
        this._linkHelper.login(),
        {
          headers: {
            'Authorization': this.token
          },
          observe: 'response'
        }
      ).subscribe(
        (res: HttpResponse<any>) => {
          this.user.next(res.body);
          resolve({
            state: LoginState.SUCCESS,
            data: res.body
          })
        },
        ((err: HttpErrorResponse) => {
          if (err.status === 401) {
            resolve({
              state: LoginState.BAD_TOKEN
            });
          }
        })
      )
    });
  }

  public completeAuthentication(state: string, code: string): Promise<string> {
    return new Promise((resolve) => {
      this._http.get(
        this._linkHelper.getGitHubAccessToken(code, state)
      ).subscribe((responseToken: any) => {
        if (!isNullOrUndefined(responseToken.token)) {
          this.token = responseToken.token;
          localStorage.setItem('gh:token', this.token);
          this.authenticated.next(true);
          resolve(this.token);
        }
      });
    });
  }

  private _isAuthenticated() {
    return !isNullOrUndefined(localStorage.getItem('gh:token'));
  }
}

export interface LoginResult {
  state: LoginState;
  data?: any;
}

export enum LoginState {
  SUCCESS,
  UNREGISTERED,
  BAD_TOKEN,
  FORBIDDEN
}
