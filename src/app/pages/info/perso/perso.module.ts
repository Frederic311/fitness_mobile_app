import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersoPageRoutingModule } from './perso-routing.module';

import { PersoPage } from './perso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersoPageRoutingModule
  ],
  declarations: [PersoPage]
})
export class PersoPageModule {}
