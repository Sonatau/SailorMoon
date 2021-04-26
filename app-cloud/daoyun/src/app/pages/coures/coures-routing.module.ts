import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CouresPage } from './coures.page';

const routes: Routes = [
  {
    path: '',
    component: CouresPage
  },  {
    path: 'create-coures',
    loadChildren: () => import('./create-coures/create-coures.module').then( m => m.CreateCouresPageModule)
  },
  {
    path: 'join-by-code',
    loadChildren: () => import('./join-by-code/join-by-code.module').then( m => m.JoinByCodePageModule)
  },
  {
    path: 'join-by-qr',
    loadChildren: () => import('./join-by-qr/join-by-qr.module').then( m => m.JoinByQrPageModule)
  },
  {
    path: 'create-success',
    loadChildren: () => import('./create-success/create-success.module').then( m => m.CreateSuccessPageModule)
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouresPageRoutingModule {}
