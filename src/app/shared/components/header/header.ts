import { Component, 
         Input, 
         OnInit, 
         ViewEncapsulation,
         Output,
         EventEmitter} from '@angular/core';
import {Location} from '@angular/common';



@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],

  })

  export class Headercomponent  {
    @Input() bannerBackground: boolean
    @Input() text: string
    @Output() backClicked = new EventEmitter();
    constructor(private _location: Location) 
    {}
  
    goBack() {
      this.backClicked.emit(true);
    //   this._location.back();
    }

  }

