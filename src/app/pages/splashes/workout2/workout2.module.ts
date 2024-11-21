import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Workout2PageRoutingModule } from './workout2-routing.module';

import { Workout2Page } from './workout2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Workout2PageRoutingModule
  ],
  declarations: [Workout2Page]
})
export class Workout2PageModule {}
