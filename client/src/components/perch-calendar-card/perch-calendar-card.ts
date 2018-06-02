import { Component, Input } from '@angular/core';
import { IDeploymentSummary } from '../../../../shared/types/deployment/deployment-summary';

@Component({
  selector: 'perch-calendar-card',
  templateUrl: './perch-calendar-card.html',
  styleUrls: ['./perch-calendar-card.scss']
})
export class PerchCalendarCard {
  @Input() deploymentSummary: IDeploymentSummary;
}
