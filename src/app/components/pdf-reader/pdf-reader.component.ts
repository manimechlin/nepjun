import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-pdf-reader',
  templateUrl: './pdf-reader.component.html',
  styleUrls: ['./pdf-reader.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PdfReaderComponent implements OnInit {
  @Input() pdfSrc: string;
  @Input() seePdf: boolean;
  @Output() closePdfView = new EventEmitter();
  @Input() viewTermandService:boolean;
  @Input() viewPrivacy:boolean;
  showSpinner = true;
 

  constructor() { }

  ngOnInit() {
    
  }

  afterLoad(event) {
    setTimeout(() =>  this.showSpinner = false, 500);
  }

}
