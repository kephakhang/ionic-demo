import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoCallPage } from './video-call.page';

const routes: Routes = [
  {
    path: '',
    component: VideoCallPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoCallPageRoutingModule {}
