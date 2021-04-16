import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchCouresComponent } from './components/search-coures/search-coures.component';



@NgModule({
  declarations: [SearchCouresComponent],
  imports: [
    CommonModule
  ],
  exports:[SearchCouresComponent],
  entryComponents:[SearchCouresComponent]
})
export class SharedModule { }
