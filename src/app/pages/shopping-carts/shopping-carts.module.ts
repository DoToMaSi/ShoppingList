import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShoppingCartsPageRoutingModule } from './shopping-carts-routing.module';

import { ShoppingCartsPage } from './shopping-carts.page';
import { ImportCartPage } from './import-cart/import-cart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ShoppingCartsPageRoutingModule
  ],
  declarations: [ShoppingCartsPage, ImportCartPage]
})
export class ShoppingCartsPageModule {}
