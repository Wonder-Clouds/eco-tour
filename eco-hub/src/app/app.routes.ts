import { Routes } from '@angular/router';
import { Home } from './modules/home/home';
import { Services } from './modules/services/services';
import { Login } from './modules/login/login';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'servicios', component: Services },
];
