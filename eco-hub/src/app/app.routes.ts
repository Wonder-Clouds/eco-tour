import { Routes } from '@angular/router';
import { Main } from './layouts/main/main';
import { Home } from './features/dashboard/pages/home/home';
import { Services } from './features/services/pages/services/services';
import { Login } from './features/auth/pages/login/login';
import { ServiceDetailPage } from './features/services/pages/service-detail/service-detail';
import { CreateServicePage } from './features/services/pages/create-service/create-service';
import { Clients } from './features/clients/pages/clients/clients';
import { CreateGroup } from './features/groups/pages/create-group/create-group';
import { Groups } from './features/groups/pages/groups/groups';
import { GroupMembers } from './features/groups/pages/group-members/group-members';
import { Quotes } from './features/quotes/pages/quotes/quotes';
import { CreateQuote } from './features/quotes/pages/create-quote/create-quote';
import { Reserves } from './features/reserves/pages/reserves/reserves';

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
      { path: 'grupos', component: Groups },
      { path: 'grupos/:id/miembros', component: GroupMembers },
      { path: 'grupos/crear-grupo', component: CreateGroup },
      { path: 'cotizaciones', component: Quotes },
      { path: 'cotizaciones/crear-cotizacion', component: CreateQuote },
      {
        path: 'cotizaciones/detalle/:id',
        loadComponent: () =>
          import('./features/quotes/pages/quote-detail/quote-detail').then(
            (m) => m.QuoteDetail
          ),
      },
      { path: 'reservas', component: Reserves },
    ],
  },

  { path: 'login', component: Login },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
