import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainCoachPage } from './main-coach.page';

const routes: Routes = [
  {
    path: '',
    component: MainCoachPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainCoachPageRoutingModule {}
