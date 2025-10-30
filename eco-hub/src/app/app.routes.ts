import { Routes } from '@angular/router';
import { Main } from './layouts/main/main';
import { Home } from './features/dashboard/pages/home/home';
import { Services } from './features/services/pages/services/services';
import { Login } from './features/auth/pages/login/login';
import { ServiceDetailPage } from './features/services/pages/service-detail/service-detail';
import { CreateServicePage } from './features/services/pages/create-service/create-service';
import { Clients } from './features/clients/pages/clients/clients';

export const routes: Routes = [
  {
    path: '',
    component: Main,
    children: [
      { path: '', component: Home },
      { path: 'servicios', component: Services },
      { path: 'servicios/crear-servicio', component: CreateServicePage },
      { path: 'servicios/:id', component: ServiceDetailPage },
      { path: 'clientes', component: Clients },
    ],
  },

  { path: 'login', component: Login },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
