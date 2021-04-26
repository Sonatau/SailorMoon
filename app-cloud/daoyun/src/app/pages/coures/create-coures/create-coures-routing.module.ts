import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateCouresPage } from './create-coures.page';

const routes: Routes = [
  {
    path: '',
    component: CreateCouresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateCouresPageRoutingModule {}
