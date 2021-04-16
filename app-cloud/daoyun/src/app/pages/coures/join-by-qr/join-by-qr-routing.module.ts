import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JoinByQrPage } from './join-by-qr.page';

const routes: Routes = [
  {
    path: '',
    component: JoinByQrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JoinByQrPageRoutingModule {}
