import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDeatilPageRoutingModule } from './edit-deatil-routing.module';

import { EditDeatilPage } from './edit-deatil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDeatilPageRoutingModule
  ],
  declarations: [EditDeatilPage]
})
export class EditDeatilPageModule {}
