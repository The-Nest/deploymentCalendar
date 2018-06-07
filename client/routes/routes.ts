import { PreloadingStrategy, Route, RouterModule, Routes } from '@angular/router';
import { PerchHomePage } from 'src/containers/homePage/perch-home-page';
import { PerchAllDeploymentsPage } from 'src/containers/allDeploymentsPage/perch-all-deployments-page';
import { PerchCreateDeploymentPage } from 'src/containers/createDeploymentPage/perch-create-deployment-page';
import { PerchLoginPage } from 'src/containers/loginPage/perch-login-page';

const appRoutes: Routes = [
  { path: '',
    component: PerchHomePage
  },
  { path: 'login',
    component: PerchLoginPage
  },
  { path: 'deployment/all',
    component: PerchAllDeploymentsPage
  },
  { path: 'deployment/create',
    component: PerchCreateDeploymentPage
  }
];

export const Routing = RouterModule.forRoot(appRoutes, {});
