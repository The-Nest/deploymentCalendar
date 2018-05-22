import { PreloadingStrategy, Route, RouterModule, Routes } from '@angular/router';
import { PerchHomePage } from 'src/containers/homePage/perch-home-page';
import { PerchAllDeploymentsPage } from 'src/containers/allDeploymentsPage/perch-all-deployments-page';

const appRoutes: Routes = [
  { path: '', 
    component: PerchHomePage 
  },
  { path: 'deployment/all',
    component: PerchAllDeploymentsPage
  }
];

export const Routing = RouterModule.forRoot(appRoutes, {});
