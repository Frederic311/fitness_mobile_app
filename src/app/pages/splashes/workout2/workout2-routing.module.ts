import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Workout2Page } from './workout2.page';

const routes: Routes = [
  {
    path: '',
    component: Workout2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Workout2PageRoutingModule {}
