import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LinkHelper } from '../link-helper/link-helper';
import { isNullOrUndefined } from 'util';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class GitHubService {
  private _state: string = localStorage.getItem('gh:state');
  private _token: string = localStorage.getItem('gh:token');
  public authenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this._isAuthenticated());
  constructor(private _router: Router, private _linkHelper: LinkHelper, private _http: HttpClient) { }

  public generateAuthenticationURL(redirectUri?: string) {
    if (isNullOrUndefined(this._state)) {
      this._state = localStorage.getItem('gh:state');
      if (isNullOrUndefined(this._state)) {
        this._state = 'abc123';
        localStorage.setItem('gh:state', this._state);
      }
    }
    return this._linkHelper.gitHubAuthorization('Iv1.0047e1810d2de496', this._state, redirectUri);
  }

  public logout() {
   localStorage.removeItem('gh:token');
   this.authenticated.next(false);
   this._router.navigate(['/']);
  }

  public getUserData(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (isNullOrUndefined(this._token)) {
        resolve(false);
        return;
      }
      this._http.get(
        'https://api.github.com/user',
        {
          headers: {
            'Authorization': `token ${this._token}`
          },
          observe: 'response'
        }
      ).subscribe(
        (res: HttpResponse<any>) => {
          resolve(true);
        },
        (err) => resolve(false)
      );
    });
  }

  public completeAuthentication(state: string, code: string): Promise<string> {
    return new Promise((resolve) => {
      this._http.get(
        this._linkHelper.getGitHubAccessToken(code, state)
      ).subscribe((responseToken: any) => {
        if (!isNullOrUndefined(responseToken.token)) {
          this._token = responseToken.token;
          localStorage.setItem('gh:token', this._token);
          this.authenticated.next(true);
          resolve(this._token);
        }
      });
    });
  }

  private _isAuthenticated() {
    return !isNullOrUndefined(localStorage.getItem('gh:token'));
  }
}
