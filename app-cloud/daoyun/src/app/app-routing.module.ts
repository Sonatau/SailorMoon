import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome', 
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'course',
    loadChildren: () => import('./pages/course/course.module').then( m => m.CoursePageModule)
  },
  {
    path: 'mine',
    loadChildren: () => import('./pages/mine/mine.module').then( m => m.MinePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/passport/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/passport/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'change-pass',
    loadChildren: () => import('./pages/passport/change-pass/change-pass.module').then( m => m.ChangePassPageModule)
  },
  {
    path: 'find-by-email',
    loadChildren: () => import('./pages/passport/find-by-email/find-by-email.module').then( m => m.FindByEmailPageModule)
  },
  {
    path: 'checkin',
    loadChildren: () => import('./pages/checkin/checkin.module').then( m => m.CheckinPageModule)
  },
  {
    path: 'member-list',
    loadChildren: () => import('./pages/member-list/member-list.module').then( m => m.MemberListPageModule)
  },  {
    path: 'register-phone',
    loadChildren: () => import('./pages/passport/register-phone/register-phone.module').then( m => m.RegisterPhonePageModule)
  },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
