import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Workout1PageRoutingModule } from './workout1-routing.module';

import { Workout1Page } from './workout1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Workout1PageRoutingModule
  ],
  declarations: [Workout1Page]
})
export class Workout1PageModule {}
