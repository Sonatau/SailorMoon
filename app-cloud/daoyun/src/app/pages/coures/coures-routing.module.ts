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


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouresPageRoutingModule {}
