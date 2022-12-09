import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportCartPage } from './import-cart/import-cart.page';

import { ShoppingCartsPage } from './shopping-carts.page';

const routes: Routes = [
  {
    path: '',
    component: ShoppingCartsPage
  },
  {
    path: 'import-cart',
    component: ImportCartPage
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingCartsPageRoutingModule {}
