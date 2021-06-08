import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoursePage } from './course.page';

const routes: Routes = [
  {
    path: '',
    component: CoursePage
  },
  {
    path: 'create-course',
    loadChildren: () => import('./create-course/create-course.module').then( m => m.CreateCoursePageModule)
  },
  {
    path: 'join-by-code',
    loadChildren: () => import('./join-by-code/join-by-code.module').then( m => m.JoinByCodePageModule)
  },
  {
    path: 'join-by-qr',
    loadChildren: () => import('./join-by-qr/join-by-qr.module').then( m => m.JoinByQrPageModule)
  },
  {
    path: 'create-success',
    loadChildren: () => import('./create-success/create-success.module').then( m => m.CreateSuccessPageModule)
  },
  {
    path: 'course-detail',
    loadChildren: () => import('./course-detail/course-detail.module').then( m => m.CourseDetailPageModule)
  },
  {
    path: 'edit-detail',
    loadChildren: () => import('./edit-detail/edit-detail.module').then( m => m.EditDetailPageModule)
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursePageRoutingModule {}
