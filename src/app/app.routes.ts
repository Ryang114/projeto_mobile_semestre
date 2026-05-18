import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'pag2',
    loadComponent: () => import('./pag2/pag2.page').then( m => m.Pag2Page)
  },
  {
    path: 'configuracoes',
    loadComponent: () => import('./configuracoes/configuracoes.page').then( m => m.ConfiguracoesPage)
  },
  {
    path: 'conta',
    loadComponent: () => import('./conta/conta.page').then( m => m.ContaPage)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'sobre-nos',
    loadComponent: () => import('./sobre-nos/sobre-nos.page').then( m => m.SobreNosPage)
  },
  {
    path: 'perfil-dev/:idDev', 
    loadComponent: () => import('./perfil-dev/perfil-dev.page').then( m => m.PerfilDevPage)
  },
];