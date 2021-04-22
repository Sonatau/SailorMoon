import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckinPage } from './checkin.page';

const routes: Routes = [
  {
    path: '',
    component: CheckinPage
  },
  {
    path: 'checkin-result',
    loadChildren: () => import('./checkin-result/checkin-result.module').then( m => m.CheckinResultPageModule)
  },
  {
    path: 'create-checkin',
    loadChildren: () => import('./create-checkin/create-checkin.module').then( m => m.CreateCheckinPageModule)
  },
  {
    path: 'coures-checkin',
    loadChildren: () => import('./coures-checkin/coures-checkin.module').then( m => m.CouresCheckinPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckinPageRoutingModule {}
