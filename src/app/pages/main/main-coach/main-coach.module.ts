import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainCoachPageRoutingModule } from './main-coach-routing.module';

import { MainCoachPage } from './main-coach.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainCoachPageRoutingModule
  ],
  declarations: [MainCoachPage]
})
export class MainCoachPageModule {}
