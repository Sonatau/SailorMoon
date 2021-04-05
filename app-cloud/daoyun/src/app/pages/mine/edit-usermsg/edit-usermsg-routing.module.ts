import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditUsermsgPage } from './edit-usermsg.page';

const routes: Routes = [
  {
    path: '',
    component: EditUsermsgPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditUsermsgPageRoutingModule {}
