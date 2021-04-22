import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MinePage } from './mine.page';

const routes: Routes = [
  {
    path: '',
    component: MinePage
  },
  {
    path: 'edit-usermsg',
    loadChildren: () => import('./edit-usermsg/edit-usermsg.module').then( m => m.EditUsermsgPageModule)
  },
  {
    path: 'usermsg',
    loadChildren: () => import('./usermsg/usermsg.module').then( m => m.UsermsgPageModule)
  },
  {
    path: 'about-us',
    loadChildren: () => import('./about-us/about-us.module').then( m => m.AboutUsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MinePageRoutingModule {}
