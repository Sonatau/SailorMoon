import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditUsermsgPageRoutingModule } from './edit-usermsg-routing.module';

import { EditUsermsgPage } from './edit-usermsg.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditUsermsgPageRoutingModule
  ],
  declarations: [EditUsermsgPage]
})
export class EditUsermsgPageModule {}
