import { Injectable } from "@angular/core";
import { ShoppingCart } from "../models/shopping-cart";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: 'root'
})

export class ListService {

  private shoppingCarts: ShoppingCart[];

  constructor(
    private storageService: StorageService
  ) {
    this.loadShoppingCarts();
  }

  public getShoppingCarts() {
    return this.shoppingCarts
  }

  public getCartById(index: number) {
    if (this.shoppingCarts) {
      return this.shoppingCarts.find((cart) => cart.index === index);
    } else {
      return null;
    }
  }

  public async addShoppingCart(cartForm: { name: string }) {
    const newShoppingCart = new ShoppingCart({...cartForm});
    this.shoppingCarts.push(newShoppingCart);

    this.shoppingCarts.map((cart, index) => {
      cart.index = (index + 1);
    });

    await this.saveShoppingCart();
    return newShoppingCart;
  }

  public async copyShoppingCart(shoppingCart: ShoppingCart, index: number) {
    const newShoppingCart = new ShoppingCart(JSON.parse(JSON.stringify({...shoppingCart})));
    newShoppingCart.name = `${newShoppingCart.name} 2`;
    this.shoppingCarts.splice(index, 0, newShoppingCart);

    this.shoppingCarts.map((cart, index) => {
      cart.index = (index + 1);
    });

    await this.saveShoppingCart();
    return newShoppingCart;
  }

  public async loadShoppingCarts() {
    try {
      const shoppingCarts = await this.storageService.get('shoppingCarts') as any[];
      this.shoppingCarts = [];

      if (shoppingCarts && shoppingCarts.length > 0) {
        shoppingCarts.map((cart, index) => {
          cart.index = (index + 1);
          this.shoppingCarts.push(new ShoppingCart(cart));
        })
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  public async removeShoppingCart(cart?: ShoppingCart) {
    if (cart) {
      const cartIndex = this.shoppingCarts.findIndex((cartList) => cartList.index === cart.index);
      this.shoppingCarts.splice(cartIndex, 1);

      return await this.storageService.set('shoppingCarts', this.shoppingCarts);
    }
  }

  public async saveShoppingCart(cart?: ShoppingCart) {
    if (cart) {
      const cartIndex = this.shoppingCarts.findIndex((cartList) => cartList.index === cart.index);
      if (cartIndex !== -1) {
        this.shoppingCarts[cartIndex] = cart;
      }
    }

    return await this.storageService.set('shoppingCarts', this.shoppingCarts);
  }
}
