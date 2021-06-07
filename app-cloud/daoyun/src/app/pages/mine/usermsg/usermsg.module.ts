import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsermsgPageRoutingModule } from './usermsg-routing.module';

import { UsermsgPage } from './usermsg.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsermsgPageRoutingModule
  ],
  declarations: [UsermsgPage]
})
export class UsermsgPageModule {}
