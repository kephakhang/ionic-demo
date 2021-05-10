import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


import { environment } from './../environments/environment';
import { Router } from '@angular/router';
import { AuthServiceProvider } from 'src/app/providers/auth-service/auth-service';
import { common } from './providers/common/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  user: any;
  assetRoot = environment.assetRoot;
  public selectedIndex = 0;
  public appPages = null ;

  constructor(
    private platform: Platform,
    private router: Router,
    public auth: AuthServiceProvider) {

      
      this.appPages = [     
          {
            title: 'PopupDemo',
            url: '/MainPage',
            icon: 'home.svg'
          },
          {
            title: 'DatePicker',
            url: '/DatePickupPage',
            icon: 'date.svg'
          },
          {
            title: 'WebRtc',
            url: '/VideoCallPage',
            icon: 'video-call.svg'
          },
        ];
  }

/**
   * 로그인 페이지로 전환해 주는 함수
   */
  login() {
    this.auth.navigateRoot('/LoginPage') ;
  }

  /**
   * 로그인 정보를 해제하고 로그인 화면으로 전환해 주는 함수
   */
  logout() {
    this.auth.logout();
    this.auth.navigateRoot('/LoginPage');
  }

  // initializeApp() {
  //   this.platform.ready().then(() => {
  //     this.statusBar.styleDefault();
  //     this.splashScreen.hide();
  //   });
  // }

  ngOnInit() {
    this.selectedIndex = 0;
    // const path = window.location.pathname.split('folder/')[1];
    // if (path !== undefined) {
    //   this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    // }
  }
}
