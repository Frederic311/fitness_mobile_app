import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Workout1Page } from './workout1.page';

const routes: Routes = [
  {
    path: '',
    component: Workout1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Workout1PageRoutingModule {}
