import { PreloadingStrategy, Route, RouterModule, Routes } from '@angular/router';
import { PerchHomePage } from 'src/containers/homePage/perch-home-page';
import { PerchAllDeploymentsPage } from 'src/containers/allDeploymentsPage/perch-all-deployments-page';
import { PerchCreateDeploymentPage } from 'src/containers/createDeploymentPage/perch-create-deployment-page.';
import { GitHubAuthenticationGuard } from 'src/guards/github-authentication.guard';

const appRoutes: Routes = [
  { path: '',
    component: PerchHomePage
  },
  { path: ':login/deployment/all',
    component: PerchAllDeploymentsPage,
    canActivate: [ GitHubAuthenticationGuard ]
  },
  { path: 'deployment/all',
    component: PerchAllDeploymentsPage,
    canActivate: [ GitHubAuthenticationGuard ]
  },
  { path: 'deployment/create',
    component: PerchCreateDeploymentPage,
    canActivate: [ GitHubAuthenticationGuard ]
  }
];

export const Routing = RouterModule.forRoot(appRoutes, {});
