import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegUsermsgPage } from './reg-usermsg.page';

const routes: Routes = [
  {
    path: '',
    component: RegUsermsgPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegUsermsgPageRoutingModule {}
