import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module'
import { RouterModule } from '@angular/router';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { FileUploadModule } from 'ng2-file-upload';

import { FoodOrderingComponent } from './food-ordering.component';
import { FoodOrderingRoutes } from './food-ordering.routing';
import { LandingComponent } from '../landing/landing.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
 import {SidebarComponent} from '../sidebar/sidebar.component'
 import{MapComponent} from '../sidebar/map/map.component'
import { ContactComponent } from '../sidebar/content/contact.comonent';
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(FoodOrderingRoutes),
    MatGoogleMapsAutocompleteModule,
    FileUploadModule
  ],
  declarations: [
    FoodOrderingComponent,
    LandingComponent,
    ThankyouComponent,
    SidebarComponent,
    MapComponent,
    ContactComponent
  
 
  ]
})
export class FoodOrderingModule { }