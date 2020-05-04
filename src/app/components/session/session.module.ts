import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module'
import { RouterModule } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { SessionRoutes } from './session.routing';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PdfReaderComponent } from '../pdf-reader/pdf-reader.component';
import { ResetPasswordComponent } from '../session/reset-password/reset-password.component';
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(SessionRoutes),
    PdfViewerModule,
  ],
  declarations: [
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    PdfReaderComponent,
    ResetPasswordComponent
  ]
})
export class SessionModule { }