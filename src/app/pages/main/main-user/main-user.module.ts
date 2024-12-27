import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainUserPageRoutingModule } from './main-user-routing.module';

import { MainUserPage } from './main-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainUserPageRoutingModule
  ],
  declarations: [MainUserPage]
})
export class MainUserPageModule {}
