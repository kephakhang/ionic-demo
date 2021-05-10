import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'MainPage', pathMatch: 'full' },
  { path: 'LoginPage', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'DatePickupPage', loadChildren: './pages/datepickup/datepickup.module#DatePickupPageModule' },
  { path: 'MainPage', loadChildren: './pages/main/main.module#MainPageModule' },
  { path: 'VideoCallPage',
    loadChildren: () => import('./pages/videoCall/video-call.module').then(m => m.VideoCallPageModule)
  },
  { path: 'DictationPage', loadChildren: './pages/dictation/dictation.module#DictationPageModule' },
 ];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
