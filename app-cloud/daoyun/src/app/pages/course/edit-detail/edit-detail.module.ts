import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDetailPageRoutingModule } from './edit-detail-routing.module';

import { EditDetailPage } from './edit-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDetailPageRoutingModule
  ],
  declarations: [EditDetailPage]
})
export class EditDetailPageModule {}
