import {Component,ViewChild,ElementRef } from '@angular/core';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import {Platform} from '@ionic/angular';
import {common} from 'src/app/providers/common/common';
import { DictationPage } from './../dictation/dictation';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
  styleUrls: ['./main.scss']
})
/**
 * SDUA 앱 초기 메인 화면 페이지 클래스
 */
export class MainPage  {

  @ViewChild('splashDiv',{read: ElementRef, static: false}) splashDiv: any;

  constructor(public platform: Platform, public auth: AuthServiceProvider) {
     
    this.initializeApp() ;
  }


  initializeApp() {
    //this.splashScreen.show();
    this.auth.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.auth.getUser()
         .then((user) => {
          this.auth.user = user ;
      }, err => {
        this.auth.showError(err) ;
        this.auth.navigateRoot('LoginPage') ;
      });
      // this.auth.getUser()
      //   .then((user) => {
      //     this.auth.get('/api/accessToken')
      //       .then((res: any) => {
      //         this.auth.user=res;
      //         this.auth.setStorage(common.USER,res);
      //       },(err) => {
      //         this.auth.removeStorage(common.USER);
      //         this.auth.user=null;
      //         this.auth.navigateRoot('/LoginPage');
      //       });
      //   },(err) => {
      //     this.auth.removeStorage(common.USER);
      //     this.auth.user=null;
      //     this.auth.navigateRoot('/LoginPage');
      //   });
    });
  }

  /**
   * 로그인 페이지로 전환해 주는 함수
   */
  login() {
    this.auth.navigateRoot('/LoginPage');
  }

  /**
   * 로그인 정보를 해제하고 로그인 화면으로 전환해 주는 함수
   */
  logout() {
    this.auth.logout();
    this.auth.navigateRoot('/LoginPage');
  }


  ionViewWillEnter() {

    this.auth.setTitle('홈');  
    this.auth.getUser().then(user => {
      if( user === undefined || user == null ){
        this.auth.navigateRoot('/LoginPage') ;
      }
    }, err => {
        this.auth.navigateRoot('/LoginPage');
    }) ;
  }

  /**
   * 상세 정보 팝업 다이얼로그 클래스에서 수정한 내용을 리턴해 주는 Callback 함수
   * @param {any} dictation 수정된 분석 정보
   */
  public callback = (dictation) => {
    if (dictation != null ) {
      this.auth.presentAlert(dictation.reaction) ;
    }
  }

  public async popupModalPage() {
    const data = {
      url: 'https://www.youtube.com/watch?v=VZR9TmL4-JQ',
      email: this.auth.user.email,
      reaction: null
    } ;
    const modal = await this.auth.modal.create({
      component: DictationPage,
      componentProps: data
    }) ;

    modal.onDidDismiss().then((params: any) => {
       console.log(JSON.stringify(params.data));
       if( params.data.reaction )
          this.auth.presentAlert(params.data.reaction) ;
    }) ;

    await modal.present();
  }
}
