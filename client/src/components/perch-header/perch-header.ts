import { Component } from '@angular/core';
import { LinkHelper } from 'src/services/link-helper/link-helper';

@Component({
  selector: 'perch-header',
  templateUrl: './perch-header.html',
  styleUrls: ['./perch-header.scss']
})

export class PerchHeader {
  constructor( private _linkHelper: LinkHelper ){}
  
  public homeUrl = this._linkHelper.homeUrl();  
  public createUrl = this._linkHelper.deploymentCreate();
}
