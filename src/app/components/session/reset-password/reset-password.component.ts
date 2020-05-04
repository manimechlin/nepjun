import { Component ,OnInit, ViewEncapsulation} from "@angular/core";
import { ApiService } from 'src/app/services';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({

    selector:'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['../session.component.scss'],
    encapsulation: ViewEncapsulation.None,

})

export class ResetPasswordComponent implements OnInit
{
    newPassword: string = '';
    showSpinner = false;
    message: string;
    status: string;
    constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute, private http: HttpClient )
    {

    }

    ngOnInit()
    {
    }

  updatePassword()
  {
    this.showSpinner = true;
    let userid = this.route.snapshot.paramMap.get("user_id");
    this.apiService.post('/user/updatepassword', {"userid": userid, "password": this.newPassword})
        .subscribe((response)=>{
          this.status = response.status;
          this.message = response.message;
          this.showSpinner = false;
    })    
  }
    
  backToLogin() {
    this.router.navigate([`session/signin`]);
  }
}
