import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckinResultPageRoutingModule } from './checkin-result-routing.module';

import { CheckinResultPage } from './checkin-result.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckinResultPageRoutingModule
  ],
  declarations: [CheckinResultPage]
})
export class CheckinResultPageModule {}
