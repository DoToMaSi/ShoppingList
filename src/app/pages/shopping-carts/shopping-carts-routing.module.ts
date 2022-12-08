import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoppingCartsPage } from './shopping-carts.page';

const routes: Routes = [
  {
    path: '',
    component: ShoppingCartsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingCartsPageRoutingModule {}
