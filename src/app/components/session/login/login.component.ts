import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/services';
import { Router } from '@angular/router';
import { setItem, getItem } from 'src/app/utils/storage';
import { User } from 'src/app/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../session.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  uemailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  email = '';
  password = '';
  message: string;
  hide = true;
  user: User;

  constructor(
    private apiService: ApiService,
    private router: Router) { 
    }

  ngOnInit() {
  }

  onLogin() {
    if(this.password != '') {
      const user = {
        email: this.email,
        password: this.password
      }
      this.apiService.post('/user/login', user).subscribe(response => {
        console.log(response);
        if (response.status === 'true') {
 
          
          this.user = {
            ...response.data.user,
            userid: response.data.user.user_id,
            latitude: response.data.user.current_latitude,
            longitude: response.data.user.current_longitude,
            isLoggedIn: true,
            isPhoneVerified: response.data.user.phone_verified === 'Yes'
          }
          console.log(user)
          setItem('user', this.user);
          this.onCloseLogin()
        }else {
          this.email = '';
          this.password = '';
          this.message = response.message;
        }
      });
    }
  }

  onCloseLogin() {
    let hash = getItem('hash') ? getItem('hash') : ''
    if (hash && hash === 'location' && this.user.location_zipcode) {
      hash = 'services'
    }
    this.router.navigate([`/${hash}`]);
  }
  backToHome() {
    this.router.navigate([`/`]);
  }
  forgotPassword() {
    this.router.navigate([`session/forgot-password`]);
  }

}


