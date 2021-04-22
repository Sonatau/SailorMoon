import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchCourseComponent } from './components/search-course/search-course.component';



@NgModule({
  declarations: [SearchCourseComponent],
  imports: [
    CommonModule
  ],
  exports:[SearchCourseComponent],
  entryComponents:[SearchCourseComponent]
})
export class SharedModule { }
