import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberCheckinPageRoutingModule } from './member-checkin-routing.module';

import { MemberCheckinPage } from './member-checkin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemberCheckinPageRoutingModule
  ],
  declarations: [MemberCheckinPage]
})
export class MemberCheckinPageModule {}
