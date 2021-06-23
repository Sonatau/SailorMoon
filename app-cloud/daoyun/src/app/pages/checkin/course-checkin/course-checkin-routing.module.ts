import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseCheckinPage } from './course-checkin.page';

const routes: Routes = [
  {
    path: '',
    component: CourseCheckinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseCheckinPageRoutingModule {}
