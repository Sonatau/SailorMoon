import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegUsermsgPageRoutingModule } from './reg-usermsg-routing.module';

import { RegUsermsgPage } from './reg-usermsg.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegUsermsgPageRoutingModule
  ],
  declarations: [RegUsermsgPage]
})
export class RegUsermsgPageModule {}
