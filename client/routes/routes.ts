import { PreloadingStrategy, Route, RouterModule, Routes } from '@angular/router';
import { PerchHomePage } from 'src/containers/homePage/perch-home-page';
import { PerchAllDeploymentsPage } from 'src/containers/allDeploymentsPage/perch-all-deployments-page';
import { PerchCreateDeploymentPage } from 'src/containers/createDeploymentPage/perch-create-deployment-page.';

const appRoutes: Routes = [
  { path: '', 
    component: PerchHomePage 
  },
  { path: 'deployment/all',
    component: PerchAllDeploymentsPage
  },
  { path: 'deployment/create',
    component: PerchCreateDeploymentPage
  }
];

export const Routing = RouterModule.forRoot(appRoutes, {});
