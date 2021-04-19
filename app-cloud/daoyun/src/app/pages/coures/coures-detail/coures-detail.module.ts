import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CouresDetailPageRoutingModule } from './coures-detail-routing.module';

import { CouresDetailPage } from './coures-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CouresDetailPageRoutingModule
  ],
  declarations: [CouresDetailPage]
})
export class CouresDetailPageModule {}
