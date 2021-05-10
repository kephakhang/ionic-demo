import { environment } from './../../../environments/environment';
import { common } from './../common/common';
import {Injectable,ViewChild,ElementRef } from '@angular/core';
import { AlertController, NavController, Platform, LoadingController, ModalController } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Message } from '../../message';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';


/*
  Generated class for the this provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
  public apiHostUrl = environment.apiHostUrl ;
  public webHostUrl = environment.webHostUrl ;
  public accessToken: string = null;
  public language = 'ko';
  public okStr = null;
  public cancelStr = null;
  public closeStr = null;
  public package: string = null;
  public version: string = null;
  public root: string = "/";
  public baseHref: string = "/";
  public title: string = '' ;
  public user: any = null ;
  fileChooser: any;

  constructor(
    public router: Router,
    public modal: ModalController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public ahttp: HttpClient,
    public platform: Platform,
    public message: Message,
    public storage: Storage,
    public activateRoute: ActivatedRoute) {

    this.platform.ready()
      .then((data) => {

        this.storage.get(common.USER)
            .then(user => {
              if( user !== undefined && user != null )
                this.user = user ;
            }, err => {
              this.user = null ;
            }) ;
        this.okStr = this.message.get('ok');
        this.cancelStr = this.message.get('cancel');
        this.closeStr = this.message.get('close');
    
        this.root = "";
        this.baseHref = "./";
        this.package = 'com.youngplussoft.ionicdemo';
        this.version = '1.0.0';
        
      });
  }

  public setTitle(title) {
    this.title = title ;
  }

  public goBack() {
    this.navCtrl.pop();
  }

  public nvr(data) {
    if (data === undefined || data == null) {
      return '';
    } else {
      return data;
    }
  }


  public naviToMain() {

    document.location.href = '/main';
  }

  public getAccessToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (this.accessToken == null) {
        this.getStorage(common.USER).then((user: any) => {
          if (user != null) {
            resolve(user.accessToken);
          } else {
            resolve(null);
          }
        })
      } else {
        resolve(this.accessToken);
      }
    });
  }

  public goHome() {
    if (this.navCtrl != null) {
      this.navCtrl.navigateRoot('/home');
    }
  }

  public async showError(err: any) {
    try {

      if (err.message !== undefined) {
        this.presentAlert(err.message);
      } else {
        this.presentAlert(JSON.stringify(err));
      }

      if (err.status !== undefined && err.status === 400) {
        this.navCtrl.navigateRoot('/LoginPage');
      }
    } catch (e) {
      this.presentAlert(e);
    }
  }

  public async showLoading() {

    const loading = await this.loadingCtrl.create({
      message: '',
      spinner: 'bubbles',
      cssClass: 'background-color: rgba( 255, 255, 255, 1.0 );',
      translucent: true,
      duration: 2000000000
    });
    loading.present();
    return loading;
  }

  public async presentAlert(message: string) {

    if (message === undefined || message == null || message === '') {
      message = 'unreachable url: Please contact the administrator.';
    }

    // const alertController = document.querySelector('ion-alert-controller');
    // await alertController.componentOnReady();

    const alert = await this.alertCtrl.create({
      header: '안내',
      subHeader: '',
      message: message,
      buttons: ['확인'] // this.auth.message.get('general', 'close')]
    });

    return await alert.present();
  }

  public async promptAlert(prompt): Promise<string> {

    let resolveFunction: (confirm: string) => void;
    let rejectFunction: (confirm: string) => void;
    let promise = new Promise<string>((resolve,reject) => {
      resolveFunction = resolve;
      rejectFunction = reject ;
    });
    const alert = await this.alertCtrl.create({
      header: '알림',
      subHeader: '',
      inputs: [{ type: 'text', name: 'description', placeholder: '비디오 설명', id: 'videoDescription' }],
      message: prompt,
      cssClass: 'alertCustomCss',
      buttons: [{
        text: '취소',
        role: 'cancel',
        handler: (data) => {
          rejectFunction(null) ;
        }
      },
      {
        text: '확인',
        role: 'ok',
        handler: (data) => {

          if (data.description === undefined || data.description == null || data.description.trim() === '') {
            this.presentAlert(this.message.get('filetransfer.desc.needed'))
            return false
          }
          else {
            resolveFunction(data.description)
            return true
          }
        }
      }]
    });
    alert.present();

    return promise;

    // const alertController = document.querySelector('ion-alert-controller');
    // await alertController.componentOnReady();

  }

  public setStorage(key: string, value: any): Promise<any> {
    return new Promise<any>(resolve => {
      this.storage.ready().then(() => {
        this.storage.set(key, value).then((res) => {
          resolve(res);
        });
      })

    });
  }

  public getStorage(key: string): Promise<any> {
    return new Promise<any>(resolve => {
      this.storage.ready().then(() => {
        this.storage.get(key).then((res) => {
          resolve(res);
        });
      });
    });
  }

  public removeStorage(key: string): Promise<any> {
    return new Promise<any>(resolve => {
      this.storage.ready().then(() => {
        this.storage.remove(key).then((res) => {
          resolve(res);
        });
      });
    });
  }

  //common/http ================================================== [

  public anyToFormData(model: any, form: FormData = null, namespace = ''): FormData {
    let formData = form || new FormData();
    for (var propertyName in model) {
      if (!model.hasOwnProperty(propertyName) || model[propertyName] == undefined) continue;
      let formKey = namespace ? `${namespace}[${propertyName}]` : propertyName;
      if (model[propertyName] instanceof Date) {
        formData.append(formKey, model[propertyName].toString());
      }
      else if (model[propertyName] instanceof Array) {
        model[propertyName].forEach((element, index) => {
          if (typeof element != 'object')
            formData.append(`${formKey}[]`, element);
          else {
            const tempFormKey = `${formKey}[${index}]`;
            this.anyToFormData(element, formData, tempFormKey);
          }
        });
      }
      else if (typeof model[propertyName] === 'object' && !(model[propertyName] instanceof File)) {
        this.anyToFormData(model[propertyName], formData, formKey);
      }
      else {
        formData.append(formKey, model[propertyName].toString());
      }
    }
    return formData;
  }

  public async get(uri: string, params?: HttpParams) {

    return new Promise(async (resolve, reject) => {

      this.getAccessToken().then(async (value) => {
        var accessToken: string = value;
        if (this.isEmpty(accessToken)) {
          accessToken = '';
        }

        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'accessToken': accessToken
        });

        const loading = await this.showLoading();
        let options: any = { headers: headers };
        if (params !== undefined && params != null) {
          options = { params: params, headers: headers };
        }
        this.ahttp.get(this.apiHostUrl + uri, options)
          .subscribe((res: any) => {
            loading.dismiss();
            resolve(res);
          }, (err: any) => {
            loading.dismiss();
            reject(err);
          });
      });
    }) ;
  }


  public async delete(uri: string, params?: HttpParams) {

    return new Promise(async (resolve, reject) => {
      this.getAccessToken().then(async (value) => {
        let accessToken: string = value;
        if (this.isEmpty(accessToken)) {
          accessToken = '';
        }

        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'accessToken': accessToken
        });

        let loading = await this.showLoading()
        let options: any = { headers: headers };
        if (params !== undefined && params != null) {
          options = { params: params, headers: headers };
        }

        this.ahttp.delete(this.apiHostUrl + uri, options)
          .subscribe((res: any) => {
            loading.dismiss();
            resolve(res);
          }, (err: any) => {
            loading.dismiss();
            reject(err);
          });
      });
    });
  }

  public async post2(uri: string, body: any) {

    return new Promise((resolve, reject) => {
      this.getAccessToken().then(async (value) => {
        let accessToken: string = value;
        if (this.isEmpty(accessToken)) {
          accessToken = '';
        }
        const headers = new HttpHeaders({
          'Content-Type': 'multipart/form-data',
          'accessToken': accessToken
        });

        const formData: FormData = this.anyToFormData(body);
        const loading = await this.showLoading();
        this.ahttp.post(this.apiHostUrl + uri, formData, { headers: headers })
          .subscribe((res: any) => {
            loading.dismiss();
            resolve(res);

          }, (err) => {
            loading.dismiss();
            reject(err);
          });
      });
    });
  }


  public async post(uri: string, body: any) {

    return new Promise((resolve, reject) => {
      this.getAccessToken().then(async (value) => {
        let accessToken: string = value;
        if (this.isEmpty(accessToken)) {
          accessToken = '';
        }

        const headers = new HttpHeaders({
          'Content-Type': 'application/json;charset=UTF-8',
          'accessToken': accessToken
        });
        // headers.append('Content-Type', 'application/json;charset=UTF-8');
        // if( !this.isEmpty(accessToken) ) {
        //   headers.append('accessToken', accessToken) ;
        //   console.log('accessToken : '+accessToken);
        // }
        // console.log(headers.get('accessToken'));
        const loading = await this.showLoading();
        this.ahttp.post(this.apiHostUrl + uri, body, { headers: headers })
          .subscribe((res: any) => {
            loading.dismiss();
            resolve(res);
          }, (err) => {
            loading.dismiss();
            reject(err);
          });
      });

    });
  }

  public async put(uri: string, body: any) {

    return new Promise((resolve, reject) => {
      this.getAccessToken().then(async (value) => {
        let accessToken: string = value;
        if (this.isEmpty(accessToken)) {
          accessToken = '';
        }
        const headers = new HttpHeaders({
          'Content-Type': 'application/json;charset=UTF-8',
          'accessToken': accessToken
        });

        const formData: FormData = this.anyToFormData(body);
        const loading = await this.showLoading();
        this.ahttp.put(this.apiHostUrl + uri, formData, { headers: headers })
          .subscribe((res: any) => {
            loading.dismiss();
            resolve(res);

          }, (err) => {
            loading.dismiss();
            reject(err);
          });
      });
    });
  }

  public async put2(uri: string, body: any) {

    return new Promise((resolve, reject) => {
      this.getAccessToken().then(async (value) => {
        let accessToken: string = value;
        if (this.isEmpty(accessToken)) {
          accessToken = '';
        }
        const headers = new HttpHeaders({
          'Content-Type': 'application/json;charset=UTF-8',
          'accessToken': accessToken
        });

        //const formData: FormData = this.anyToFormData(body) ;
        const loading = await this.showLoading();
        this.ahttp.put(this.apiHostUrl + uri, body, { headers: headers })
          .subscribe((res: any) => {
            loading.dismiss();
            resolve(res);

          }, (err) => {
            loading.dismiss();
            reject(err);
          });
      });
    });
  }

  public async postMultipart(uri: string, body: any, params: URLSearchParams) {

    return new Promise((resolve, reject) => {
      this.getAccessToken().then(async (value) => {
        const headers = new HttpHeaders();
        if (params == null) {
          params = new URLSearchParams();
        }
        const accessToken: string = value;
        if (accessToken !== undefined && accessToken != null) {
          headers.append('accessToken', accessToken);
        }
        headers.append('Accept', 'application/json;charset=UTF-8');
        headers.append('Content-Type', 'multipart/form-data');
        const loading = await this.showLoading();
        this.ahttp.post(this.apiHostUrl + uri, body, { headers: headers })
          .subscribe((res: any) => {
            loading.dismiss();
            resolve(res);

          }, (err) => {
            loading.dismiss();
            reject(err);
          });

      });
    });

  }

  public hot(count?: number) {
    if( count )
      return this.setStorage('/hot', count);
    else 
      return this.getStorage('/hot');
  } 

  public cool(count?: number) {
    if( count )
      return this.setStorage('/hot', count);
    else 
      return this.getStorage('/hot');
  } 

  public login(credential: any) {

    return this.post('/login', { email: credential.email, password: credential.password });
  }

  public signup(userInfo) {
    return this.post('/signup', userInfo);
  }

  public logout() {
    this.storage.remove(common.USER);
    this.storage.remove(common.PARAMS);
    this.storage.remove(common.VIDEO);
    this.storage.remove(common.STAT_PARAMS);
    this.accessToken = null;
    this.user = null ;
    this.navCtrl.navigateRoot('/LoginPage');
  }

  public isEmpty(value: string): boolean {
    if (value == '' || value == null || value == undefined || value == 'null') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 사용자 정보를 Promise<user> 형식으로 스토리지에서 가져오는 함수
   */
  public getUser(): Promise<any> {

    if (this.user !== undefined && this.user != null) {
      return new Promise((resolve, reject) => {
        resolve(this.user);
      });
    }
    else {
      return new Promise((resolve, reject) => {
        this.storage.get(common.USER)
          .then((user) => {
            this.user = user;
            resolve(this.user);
          }, (err) => {
            reject(err);
          });
      });
    }
  }

  public navigateRoot(uri: string, data?: any) {
    this.navigate('root', uri, data)
  }

  public navigateForward(uri: string, data?: any) {
    this.navigate('forward', uri, data)
  }

  public navigateBack(uri: string, data?: any) {
    this.navigate('back', uri, data)
  }

  public navigate(direction, uri, data) {

    if (data === undefined || data == null) {
      this.removeStorage(common.NAVIGATION_EXTRA).then(res => {
        switch (direction) {
          case 'root': this.navCtrl.navigateRoot(uri);
            break;
          case 'forward': this.navCtrl.navigateForward(uri);
            break;
          case 'back': this.navCtrl.navigateBack(uri);
            break;
        }
      });

    } else {
      this.setStorage(common.NAVIGATION_EXTRA, data)
        .then(extraData => {
          switch (direction) {
            case 'root': this.navCtrl.navigateRoot(uri);
              break;
            case 'forward': this.navCtrl.navigateForward(uri);
              break;
            case 'back': this.navCtrl.navigateBack(uri);
              break;
          }
        });
    }
  }

  public getNavigationExtra() {

    return new Promise((resolve, reject) => {
      this.getStorage(common.NAVIGATION_EXTRA)
        .then(data => {
          //this.removeStorage(common.NAVIGATION_EXTRA) ;
          resolve(data)
        }, err => {
          reject(err);
        });
    });
  }

  public navigateWithParams(uri, params) {
    let navigationExtras: NavigationExtras = {
      queryParams: params
    };
    this.setStorage(common.NAVIGATION_EXTRA, params)
      .then(res => {
        this.router.navigate([uri], navigationExtras);
      });
  }

  public isMobileNumber(str: string): boolean {
    return /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/.test(str);
  }

  public isValidEmail(str: string): boolean {
    return (/^[_a-z0-9-]+(.[_a-z0-9-]+)*@(?:\w+\.)+\w+$/.test(str) || /^[_a-z0-9-]+(.[_a-z0-9-]+)*@(?:\w+\-)+\w+\.+\w+$/.test(str));
  }

  public getImageUrl(id): string {
    return this.apiHostUrl + 'api/attachment/image?id=' + id;
  }
}
