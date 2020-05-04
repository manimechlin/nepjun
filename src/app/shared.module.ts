import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatRadioModule } from '@angular/material/radio'
import { MatTabsModule } from '@angular/material/tabs'
// import { MatProgressBarModule } from '@angular/material/progress-bar'
import { AgmCoreModule } from '@agm/core';
import { ModalModule } from './_modal';
import { Headercomponent } from './shared/components/header/header'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        MatAutocompleteModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatSelectModule,
        MatCheckboxModule,
        MatRadioModule,
        MatTabsModule,
        AgmCoreModule,
        ModalModule,
      
    ],
    declarations: [

        Headercomponent,
        
    ],
    exports: [ 
        CommonModule, 
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        MatAutocompleteModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatSelectModule,
        MatCheckboxModule,
        MatRadioModule,
        MatTabsModule,
        AgmCoreModule,
        ModalModule,
        Headercomponent
    ]
})
export class SharedModule { }