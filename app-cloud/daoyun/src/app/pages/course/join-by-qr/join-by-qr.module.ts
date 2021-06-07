import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JoinByQrPageRoutingModule } from './join-by-qr-routing.module';

import { JoinByQrPage } from './join-by-qr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JoinByQrPageRoutingModule
  ],
  declarations: [JoinByQrPage]
})
export class JoinByQrPageModule {}
