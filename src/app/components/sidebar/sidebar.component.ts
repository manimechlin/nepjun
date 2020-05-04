import { Component, OnInit, ViewEncapsulation, Input, Output,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
 
})
export class SidebarComponent implements OnInit  {

 @Output() navClicked = new EventEmitter();
    ngOnInit(){

}   
openNav() {
    this.navClicked.emit(true);
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.getElementById("main").style.display="none";
  }
  
  closeNav() {
    this.navClicked.emit(false);
    document.getElementById("mySidebar").style.width = "0px";
    document.getElementById("main").style.marginLeft= "0px";
    document.getElementById("main").style.display = "block";
  } 
}