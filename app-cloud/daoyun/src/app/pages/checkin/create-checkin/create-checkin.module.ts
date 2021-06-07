import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCheckinPageRoutingModule } from './create-checkin-routing.module';

import { CreateCheckinPage } from './create-checkin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateCheckinPageRoutingModule
  ],
  declarations: [CreateCheckinPage]
})
export class CreateCheckinPageModule {}
