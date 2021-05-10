import {Component,ViewChild,ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import {Platform} from '@ionic/angular';
import { DatePicker } from '@ionic-native/date-picker/ngx';

@Component({
  selector: 'page-datepickup',
  templateUrl: 'datepickup.html',
  styleUrls: ['./datepickup.scss']
})
/**
 * SDUA 앱 초기 메인 화면 페이지 클래스
 */
export class DatePickupPage  {
  value: string = null ;
  minDate: string = "0000-00-00";
  maxDate: string = "9999-12-31";

  @ViewChild('splashDiv',{read: ElementRef, static: false}) splashDiv: any;

  constructor(private datePicker: DatePicker,private datePipe: DatePipe, public platform: Platform, public auth: AuthServiceProvider) {
     
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

    this.auth.setTitle('DatePickup');  
    this.auth.getUser().then(user => {
      if( user === undefined || user == null ){
        this.auth.navigateRoot('/LoginPage') ;
      }
    }, err => {
        this.auth.navigateRoot('/LoginPage');
    }) ;
  }

  pickupDate() {
    this.showNativeDatePicker();
    
  }

  
  showNativeDatePicker() {

    // this.beforeClick.emit();

    this.datePicker.show({

      date: this.value ? new Date(this.value) : new Date(),

      mode: 'date',

      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,

      minDate: new Date(this.minDate).getTime() || '',

      maxDate: new Date(this.maxDate).getTime() || '',

      allowOldDates: false,

      allowFutureDates: true

    }).then(

      (date: Date) => {

        const d = this.datePipe.transform(date, 'yyyy-MM-dd');

        this.value = d;

        //this.onClick.emit(d);

      },

      err => console.log(err)

    );

  }
  
}
