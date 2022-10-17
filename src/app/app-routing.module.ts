import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./views/login/login.module').then( m => m.LoginPageModule),
    canActivate: [LoginGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./views/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'signup',
    loadChildren: () => import('./views/signup/signup.module').then( m => m.SignupPageModule),
    canActivate: [LoginGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./views/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule),
    canActivate: [LoginGuard]
  },
  {
    path: 'loginscreen',
    loadChildren: () => import('./views/loginscreen/loginscreen.module').then( m => m.LoginscreenPageModule),
    canActivate: [LoginGuard]
  }





];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
