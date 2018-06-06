import { Component } from '@angular/core';
import { LinkHelper } from '../../services/link-helper/link-helper';

@Component({
  selector: 'perch-login-page',
  templateUrl: './perch-login-page.html',
  styleUrls: ['./perch-login-page.scss']
})

export class PerchLoginPage {
  constructor( private _linkHelper: LinkHelper ){}
  
  public homeUrl = this._linkHelper.homeUrl();
}
