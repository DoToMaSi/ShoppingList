import { Injectable } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ShoppingCart } from "../models/shopping-cart";
import { StorageService } from "./storage.service";
import { CurrencyPipe } from "@angular/common";
import { ShoppingCartItem } from "../models/shopping-cart-item";

@Injectable({
  providedIn: 'root'
})

export class ListService {

  private shoppingCarts: ShoppingCart[];

  constructor(
    private storageService: StorageService,
    private socialSharing: SocialSharing,
    private platform: Platform,
    private currencyPipe: CurrencyPipe
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

  public parseListToString(shoppingCart: ShoppingCart): string {
    let str = `Lista: ${shoppingCart.name}\n\n===\n`;
    if (shoppingCart.cartItems.length > 0) {
      shoppingCart.cartItems.forEach((cartItem, index) => {
        if (cartItem.itemName) {
          str += `\n- `;
          if (cartItem.quantity) {
            str += `${cartItem.quantity}× `;
          }
          str += `${cartItem.itemName}`;
          if (cartItem.value) {
            str += `: ${this.currencyPipe.transform(cartItem.value, 'BRL', 'R$', '1.2-2')} cada`;
          }
          str += `;`;
        }

        if (index === (shoppingCart.cartItems.length - 1)) {
          str += `\n`;
        }
      });

      if (shoppingCart.getCartTotal()) {
        str += `\nVALOR TOTAL: ${this.currencyPipe.transform(shoppingCart.getCartTotal(), 'BRL', 'R$', '1.2-2')}\n`;
      }
    } else {
      str += `\n[Esta lista está vazia]\n`;
    }

    str += `\n===\n\nLista gerada pelo app Shopping Cart. (Não apague os "===" ou o que estiver entre eles, ou seja, os itens da lista)`;
    console.log(str);
    return str;
  }

  public async parseStringToList(string: string): Promise<ShoppingCart> {
    const shoppingCartImport = new ShoppingCart();
    const strTitleContent = string.replace(/\n/g, '').split('===')[0];
    if (strTitleContent && strTitleContent.includes('Lista: ')) {
      shoppingCartImport.name = strTitleContent.replace('Lista: ', '');
    } else {
      shoppingCartImport.name = `Lista Importada ${new Date().toISOString()}`;
    }

    const strListContent = string.replace(/\n/g, '').split('===')[1];
    if (strListContent) {
      const itemList = strListContent.trim().split(';').filter((str) => str.includes('-'));
      console.log(itemList);

      if (itemList.length > 0) {
        itemList.forEach((item) => {
          const cartItem: ShoppingCartItem = {
            itemName: '',
            quantity: null,
            value: null
          };

          const quantityString = item.split('× ')[0];
          if (quantityString) {
            cartItem.quantity = parseFloat(quantityString);
          }

          console.log(cartItem);
        })
      }

      return shoppingCartImport;
    } else {
      throw new Error(`Erro ao tentar importar esta Lista de Compras. Verifique o texto copiado e garanta que nada dentro dos "===" foi apagado ou editado. Não apague os "===" também`);
    }
  }

  public async shareShoppingList(shoppingCart: ShoppingCart) {
    try {
      const shoppingCartString = this.parseListToString(shoppingCart);
      if (this.platform.is('mobile')) {
        return this.socialSharing.share(shoppingCartString);
      } else {
        return shoppingCartString;
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}
