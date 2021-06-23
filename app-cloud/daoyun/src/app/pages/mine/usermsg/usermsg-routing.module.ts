import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsermsgPage } from './usermsg.page';

const routes: Routes = [
  {
    path: '',
    component: UsermsgPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsermsgPageRoutingModule {}
