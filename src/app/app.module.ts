
import { DictationPageModule } from './pages/dictation/dictation.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

import { Message } from './message';
import { AuthServiceProvider } from './providers/auth-service/auth-service';
import { IonicStorageModule } from '@ionic/storage';

import { DatePipe } from '@angular/common';
import { DatePicker } from '@ionic-native/date-picker/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    DictationPageModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb','sqlite','websql']
    })],
  providers: [
    HttpClient,
    Message,
    AuthServiceProvider,
    ScreenOrientation,
    DatePicker,
    DatePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
