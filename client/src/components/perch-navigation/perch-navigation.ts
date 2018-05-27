import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LinkHelper } from 'src/services/link-helper/link-helper';

@Component({
  selector: 'perch-navigation',
  templateUrl: './perch-navigation.html',
  styleUrls: ['./perch-navigation.scss']
})

export class PerchNavigation {
  @Output() closeNav = new EventEmitter<void>();

  constructor( private _linkHelper: LinkHelper ){}
  
  public homeUrl = this._linkHelper.homeUrl();
  public createUrl = this._linkHelper.deploymentCreate();

}
