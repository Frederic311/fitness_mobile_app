import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersoPage } from './perso.page';

const routes: Routes = [
  {
    path: '',
    component: PersoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersoPageRoutingModule {}
