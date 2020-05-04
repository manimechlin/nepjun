import { Component, OnInit, ViewEncapsulation, Input, Output,EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  encapsulation: ViewEncapsulation.None,
 
})
export class ContactComponent implements OnInit  {
  constructor(private router:Router){}
  toggle:boolean;
@Output() navContactClicked = new EventEmitter();
    ngOnInit(){
    

}   
toggleNav(isToggle) {
  this.toggle = isToggle;
}

}