import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { ApiService } from 'src/app/services';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../session.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ForgotPasswordComponent implements OnInit {
  email: string = '';
  uemailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  showSpinner = false;
  message: string;
  status: string;
  constructor(private apiService: ApiService, private router: Router) {

   }

  ngOnInit() {
   
  }

  forgotPassword()
  { 
    this.showSpinner = true;
    this.apiService.post('/user/nepjun/forgotpassword',{"email": this.email}).subscribe((response)=>{
      this.status = response.status;
      this.message = response.message;
      this.showSpinner = false;
    })  
  }



  backToLogin() {
    this.router.navigate([`session/signin`]);
  }

}
