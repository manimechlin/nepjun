import { Routes } from '@angular/router';

export const AppRoutes: Routes = [
  {
  path: 'session',
  loadChildren: './components/session/session.module#SessionModule'
  }, {
    path: ':hash',
    loadChildren: './components/food-ordering/food-ordering.module#FoodOrderingModule'
  }, 
  {
    path: '**',
    loadChildren: './components/food-ordering/food-ordering.module#FoodOrderingModule'
  }
];
