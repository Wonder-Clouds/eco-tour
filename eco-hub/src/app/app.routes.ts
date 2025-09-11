import { Routes } from '@angular/router';
import { Main } from './layouts/main/main';
import { Home } from './features/dashboard/pages/home/home';
import { Services } from './features/services/pages/services/services';
import { Login } from './features/auth/pages/login/login';
import { ServiceDetailPage } from './features/services/pages/service-detail/service-detail';

export const routes: Routes = [
  {
    path: '',
    component: Main,
    children: [
      { path: '', component: Home },
      { path: 'servicios', component: ServiceDetailPage },
    ],
  },

  { path: 'login', component: Login },
];
