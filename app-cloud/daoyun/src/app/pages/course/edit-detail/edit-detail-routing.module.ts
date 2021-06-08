import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDetailPage } from './edit-detail.page';

const routes: Routes = [
  {
    path: '',
    component: EditDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDetailPageRoutingModule {}
