import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CouresPageRoutingModule } from './coures-routing.module';

import { CouresPage } from './coures.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CouresPageRoutingModule
  ],
  declarations: [CouresPage]
})
export class CouresPageModule {}
