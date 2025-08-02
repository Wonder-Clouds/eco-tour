import { Routes } from '@angular/router';
import { Home } from './modules/home/home';
import { Services } from './modules/services/services';

export const routes: Routes = [
  { path: '', component: Home },
  { path: '/servicios', component: Services },
];
