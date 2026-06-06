import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'resultados-busqueda',
    loadComponent: () => import('./pages/resultados-busqueda/resultados-busqueda.page').then( m => m.ResultadosBusquedaPage),
    canActivate: [authGuard]
  },
  {
    path: 'detalle-lugar/:id',
    loadComponent: () => import('./pages/detalle-lugar/detalle-lugar.page').then( m => m.DetalleLugarPage),
    canActivate: [authGuard]
  },
  {
    path: 'confirmar-reserva',
    loadComponent: () => import('./pages/confirmar-reserva/confirmar-reserva.page').then( m => m.ConfirmarReservaPage),
    canActivate: [authGuard]
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then(m => m.HomePage)
      },
      {
        path: 'mis-reservas',
        loadComponent: () => import('./pages/mis-reservas/mis-reservas.page').then(m => m.MisReservasPage)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];