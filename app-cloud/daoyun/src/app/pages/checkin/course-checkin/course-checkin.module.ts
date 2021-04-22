import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CourseCheckinPageRoutingModule } from './course-checkin-routing.module';

import { CourseCheckinPage } from './course-checkin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CourseCheckinPageRoutingModule
  ],
  declarations: [CourseCheckinPage]
})
export class CourseCheckinPageModule {}
