import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCouresPageRoutingModule } from './create-coures-routing.module';

import { CreateCouresPage } from './create-coures.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateCouresPageRoutingModule
  ],
  declarations: [CreateCouresPage]
})
export class CreateCouresPageModule {}
