import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CouresCheckinPageRoutingModule } from './coures-checkin-routing.module';

import { CouresCheckinPage } from './coures-checkin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CouresCheckinPageRoutingModule
  ],
  declarations: [CouresCheckinPage]
})
export class CouresCheckinPageModule {}
