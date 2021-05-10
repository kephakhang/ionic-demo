import { environment } from './../../../environments/environment';
import { Component } from '@angular/core' ;
import { FormBuilder, FormGroup, Validators } from '@angular/forms' ;
import { AuthServiceProvider } from '../../providers/auth-service/auth-service' ;
import { common } from '../../providers/common/common' ;


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss']
})
/**
 * 로그인 페이지 클래스
 */
export class LoginPage {
  isFacebookLogin:boolean = false ;
  facebookUser:any ;
  loginForm: FormGroup ;
  public registerCredentials: any = { email: '', password: '' } ;

  constructor(public auth: AuthServiceProvider, private formBuilder: FormBuilder) {

    this.auth.logout();
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
      password: ['', [Validators.required, Validators.minLength(7)]]
    }) ;
  }

  /**
   * 회원가입 버튼 클릭 시 불려지는 이벤트 함수 : 회원가입 페이지로 전환해 준다.
   */
  public signup() {
    this.auth.navigateForward('/SignupPage') ;
  }

  /**
   * 사용자가 입력한 로그인 정보(email & password)를 서버에서 인증해 준다.
   */
  public login() {

    if (!this.loginForm.valid) {
      for (const key in this.loginForm.controls) {
        if (!this.loginForm.controls[key].valid) {
          this.auth.showError(key + ' : ' + this.auth.message.get('form.field.invalid')) ;
          //this.loginForm.get(key).focus() ;
          return false;
        }
      }
    }

    /*
    if ( this.registerCredentials.email < 7 ||
      this.registerCredentials.email.replace('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$','') !== '' ) {
      this.auth.showError('email : ' + this.auth.message.get('form.field.invalid')) ;
      return false;
    }

    if (this.registerCredentials.password < 7 ) {
      this.auth.showError('password : ' + this.auth.message.get('form.field.invalid'));
      return false ;
    }
    */

    //ToDo : This is just test code
    this.auth.user = {email: this.loginForm.controls['email'].value, name: 'demo'} ;
    this.auth.setStorage(common.USER, this.auth.user) ;
    this.auth.navigateRoot('/MainPage') ;
    // ToDo : This is real login code
    // this.auth.login(this.registerCredentials)
    //   .then((res: any) => {
    //     this.auth.user = res ;
    //     this.auth.setStorage(common.USER, this.auth.user).then(user =>{
    //       this.auth.navigateRoot('/MainPage') ;
    //     }, err => {
    //         this.auth.presentAlert(this.auth.message.get('login.session.invalid')) ;
    //     }) ;
        
    //   }, err => {
    //     this.auth.removeStorage(common.USER) ;
    //     this.auth.user = null ;
    //     this.auth.presentAlert(this.auth.message.get('login.fails'));
    //   });
  }
}
