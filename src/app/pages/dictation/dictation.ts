import {ChangeDetectionStrategy,Component,ViewChild,ElementRef } from '@angular/core';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { NavParams } from '@ionic/angular' ;
import { common } from 'src/app/providers/common/common';
import { IonRange } from '@ionic/angular';

@Component({
  selector: 'page-dictation',
  templateUrl: 'dictation.html',
  styleUrls: ['./dictation.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * 분성정보 상세 수정 펭이지
 */
export class DictationPage {
  public params: any ;
  public callback: any = null ;
  public hotCount = 0 ;
  public coolCount = 0 ;
  
  constructor(public auth: AuthServiceProvider, public navParams: NavParams) {
    this.params = this.navParams.data ;
  }
  
  /**
   * 뷰가 생성될때 자동으로 로드되는 함수 
   */
  ionViewDidLoad() {
    this.auth.hot().then((res: number) => {
      this.hotCount = res ;
    }) ;

    this.auth.cool().then((res: number) => {
      this.coolCount = res ;
    }) ;
  }

  /**
   * 뷰에 진입할 때 마다 자동으로 불려지는 함수 : 부모 클래스의 callback 함수를 등록해 주고 동영상 오디오를 자동으로 재 로드 한다.
   */
  ionViewWillEnter() {
  }

  /**
   * 뷰에서 나올 때 마다 자동으로 불려지는 함수 : 부모 클래스의 callback 함수에 수정된 분석정보를 아규먼트로 전달한다.
   */
  ionViewWillLeave() {
  }

  /**
   * 화면 닫기(x) 버튼을 클릭할 때 불려지는 이벤트 처리 함수
   */
  public onClose() {
    this.auth.modal.dismiss(null) ;
  }

  public onHot() {
    this.params.reaction='Hot' ;
    this.auth.hot(this.hotCount).then((res: number) => {
      this.hotCount = res ;
    }) ;
    this.auth.modal.dismiss(this.params);
  }

  public onCool() {
    this.params.reaction='Cool' ;
    this.auth.cool(this.coolCount).then((res: number) => {
      this.coolCount = res ;
    })
    this.auth.modal.dismiss(this.params);
  }

}
