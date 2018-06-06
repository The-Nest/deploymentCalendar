import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LinkHelper } from 'src/services/link-helper/link-helper';

@Component({
  selector: 'perch-footer',
  templateUrl: './perch-footer.html',
  styleUrls: ['./perch-footer.scss']
})

export class Perchfooter {
  @Output() closeNav = new EventEmitter<void>();

  constructor( private _linkHelper: LinkHelper ){}
  
  public emailLink = this._linkHelper.contactEmailLink();
  public privacyLink = this._linkHelper.privacyUrl();
  public termsOfUseLink = this._linkHelper.termsOfUseUrl();
}
