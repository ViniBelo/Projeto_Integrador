import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./views/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./views/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./views/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./views/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'loginscreen',
    loadChildren: () => import('./views/loginscreen/loginscreen.module').then( m => m.LoginscreenPageModule)
  }





];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
