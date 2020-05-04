import { Component, OnInit, ViewEncapsulation, Input, Output,EventEmitter} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None,
 
})
export class MapComponent implements OnInit  {

  
    constructor(public sanitizer: DomSanitizer, public router:Router ){}
    ngOnInit(){

}   
onGoToLanding(){
this.router.navigate(['/location'])
}
}