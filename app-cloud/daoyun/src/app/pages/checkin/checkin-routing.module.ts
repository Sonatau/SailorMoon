import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckinPage } from './checkin.page';

const routes: Routes = [
  {
    path: '',
    component: CheckinPage
  },
  {
    path: 'checkin-result',
    loadChildren: () => import('./checkin-result/checkin-result.module').then( m => m.CheckinResultPageModule)
  },
  {
    path: 'create-checkin',
    loadChildren: () => import('./create-checkin/create-checkin.module').then( m => m.CreateCheckinPageModule)
  },
  {
    path: 'course-checkin',
    loadChildren: () => import('./course-checkin/course-checkin.module').then( m => m.CourseCheckinPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckinPageRoutingModule {}
