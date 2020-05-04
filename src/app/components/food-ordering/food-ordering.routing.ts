import { Routes } from '@angular/router';

import { FoodOrderingComponent } from './food-ordering.component';
import { Component } from '@angular/core';
import { MapComponent } from '../sidebar/map/map.component';
import { ContactComponent } from '../sidebar/content/contact.comonent';

export const FoodOrderingRoutes: Routes = [{
  path: '',
  component: FoodOrderingComponent
},
{
path:'map',
component:MapComponent
},
{
  path:'contact',
  component:ContactComponent
}
];