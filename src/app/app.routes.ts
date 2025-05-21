import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';

export const routes: Routes = [
  {
    path: 'home',
    component:HomePage,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'pokemon-detail/:name',
    loadComponent: () => import('./pokemon-detail/pokemon-detail.page').then( m => m.PokemonDetailPage)
  },
];
