import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberListPage } from './member-list.page';

const routes: Routes = [
  {
    path: '',
    component: MemberListPage
  },
  {
    path: 'member-checkin',
    loadChildren: () => import('./member-checkin/member-checkin.module').then( m => m.MemberCheckinPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberListPageRoutingModule {}
