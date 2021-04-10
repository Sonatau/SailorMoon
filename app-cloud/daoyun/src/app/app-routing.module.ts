import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { StartAppGuard } from './core/start-app.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome', 
    pathMatch: 'full'
  },
  { 
    path: 'welcome',
    loadChildren: './pages/welcome/welcome.module#WelcomePageModule',
    canActivate: [StartAppGuard]
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
    path: 'coures',
    loadChildren: () => import('./pages/coures/coures.module').then( m => m.CouresPageModule)
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
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
