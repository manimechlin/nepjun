import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import Swal from 'sweetalert2'
import * as jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

(window as any).html2canvas = html2canvas;

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss']
})
export class ThankyouComponent implements OnInit {
  @Input() restaurant: any;
  @Input() user: any;
  @Input() order: any;
  @Output() gotoServices = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  async printReceipt() {
    Swal.fire({
      text: 'Do you want a copy of this receipt?',
      // type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#663ab7',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        const html = document.getElementById("receipt")
        this.exportAsPDF(`Receipt-${this.order.order_id}.pdf`, html)
        this.gotoServices.emit(this.user);
      } else {
        this.gotoServices.emit(this.user);
      }
    });
  }

  exportAsPDF(filename, html)
  { 
    html2canvas(html).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jsPDF('l', 'cm', 'a4'); //Generates PDF in landscape mode
      // let pdf = new jsPDF('p', 'cm', 'a4'); //Generates PDF in portrait mode
      pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);  
      pdf.save(filename);   
    }); 
  }

}
