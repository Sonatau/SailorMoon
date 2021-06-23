import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberCheckinPage } from './member-checkin.page';

const routes: Routes = [
  {
    path: '',
    component: MemberCheckinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberCheckinPageRoutingModule {}
