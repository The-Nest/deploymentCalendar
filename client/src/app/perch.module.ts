import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Perch } from './perch';
import { RouterModule, Routes } from '@angular/router';
import { PerchHeader } from '../components/perch-header/perch-header';
import { PerchHomePage } from '../containers/homePage/perch-home-page';
import { PerchAllDeploymentsPage } from '../containers/allDeploymentsPage/perch-all-deployments-page';
import { Routing } from '../../routes/routes';
import { PerchCreateDeploymentPage } from '../containers/createDeploymentPage/perch-create-deployment-page.';
import { LinkHelper } from '../services/link-helper/link-helper';
import { HttpClientModule } from '@angular/common/http';
import { PerchCalendarCard } from '../components/perch-calendar-card/perch-calendar-card';
import { PerchNavigation } from '../components/perch-navigation/perch-navigation';
import { GitHubService } from '../services/github/github.service';
import { GitHubAuthenticationGuard } from '../guards/github-authentication.guard';

@NgModule({
  declarations: [
    Perch,
    PerchHeader,
    PerchHomePage,
    PerchAllDeploymentsPage,
    PerchCreateDeploymentPage,
    PerchCalendarCard,
    PerchNavigation
  ],
  imports: [
    BrowserModule,
    Routing,
    HttpClientModule
  ],
  providers: [LinkHelper, GitHubService, GitHubAuthenticationGuard],
  bootstrap: [Perch]
})

export class PerchModule { }
