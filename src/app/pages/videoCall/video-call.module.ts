import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoCallPageRoutingModule } from './video-call-routing.module';

import { VideoCallPage } from './video-call.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoCallPageRoutingModule
  ],
  declarations: [VideoCallPage]
})
export class VideoCallPageModule {}
