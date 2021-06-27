import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateSuccessPageRoutingModule } from './create-success-routing.module';

import { CreateSuccessPage } from './create-success.page';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateSuccessPageRoutingModule,
    QRCodeModule
  ],
  declarations: [CreateSuccessPage]
})
export class CreateSuccessPageModule {}
