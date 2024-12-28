import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoachSessionPageRoutingModule } from './coach-session-routing.module';

import { CoachSessionPage } from './coach-session.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoachSessionPageRoutingModule
  ],
  declarations: [CoachSessionPage]
})
export class CoachSessionPageModule {}
