import { Component, Input } from '@angular/core';
import { IDeploymentSummary } from '../../../../shared/types/deployment/deployment-summary';
import { LinkHelper } from '../../services/link-helper/link-helper';

@Component({
  selector: 'perch-create-card',
  templateUrl: './perch-create-card.html',
  styleUrls: ['./perch-create-card.scss']
})

export class PerchCreateCard {
  constructor( private _linkHelper: LinkHelper ){}
  
  public createUrl = this._linkHelper.deploymentCreateUrl();
}
