import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ShoppingCart } from '../models/shopping-cart';
import { StorageService } from './storage.service';
import { CurrencyPipe } from '@angular/common';
import { ShoppingCartItem } from '../models/shopping-cart-item';

@Injectable({
  providedIn: 'root'
})

export class ListService {

  private shoppingLists: ShoppingCart[];

  constructor(
    private storageService: StorageService,
    private socialSharing: SocialSharing,
    private platform: Platform,
    private currencyPipe: CurrencyPipe
  ) {
    this.loadShoppingCarts();
  }

  public getShoppingCarts() {
    return this.shoppingLists;
  }

  public getCartById(index: number) {
    if (this.shoppingLists) {
      return this.shoppingLists.find((cart) => cart.index === index);
    } else {
      return null;
    }
  }

  /*
      index?: number;
      name: string;
      edit?: boolean;
      cartItems?: ShoppingCartItem[];
  */

  public async addShoppingCart(cartForm: { index?: number; name: string; cartItems?: ShoppingCartItem[]; edit?: boolean }) {
    const newShoppingCart = new ShoppingCart({ ...cartForm });
    this.shoppingLists.unshift(newShoppingCart);

    this.shoppingLists.forEach((cart, index) => {
      cart.index = (index + 1);
    });

    await this.saveShoppingCart();
    return newShoppingCart;
  }

  public async copyShoppingCart(shoppingCart: ShoppingCart, index: number) {
    const newShoppingCart = new ShoppingCart(JSON.parse(JSON.stringify({ ...shoppingCart })));
    newShoppingCart.name = `${newShoppingCart.name} 2`;
    this.shoppingLists.splice(index, 0, newShoppingCart);

    this.shoppingLists.forEach((cart, idx) => {
      cart.index = (idx + 1);
    });

    await this.saveShoppingCart();
    return newShoppingCart;
  }

  public async loadShoppingCarts() {
    try {
      const shoppingLists = await this.storageService.get('shoppingLists') as any[];
      this.shoppingLists = [];

      if (shoppingLists && shoppingLists.length > 0) {
        shoppingLists.forEach((cart, index) => {
          cart.index = (index + 1);
          this.shoppingLists.push(new ShoppingCart(cart));
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  public async removeShoppingCart(cart?: ShoppingCart) {
    if (cart) {
      const cartIndex = this.shoppingLists.findIndex((cartList) => cartList.index === cart.index);
      this.shoppingLists.splice(cartIndex, 1);

      return await this.storageService.set('shoppingLists', this.shoppingLists);
    }
  }

  public async saveShoppingCart(cart?: ShoppingCart) {
    if (cart) {
      const cartIndex = this.shoppingLists.findIndex((cartList) => cartList.index === cart.index);
      if (cartIndex !== -1) {
        this.shoppingLists[cartIndex] = cart;
      }
    }

    return await this.storageService.set('shoppingLists', this.shoppingLists);
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

    str += `\n===\n\nLista gerada pelo app Shopping Cart. (NÃO EDITE ESTA MENSAGEM CASO VOCÊ QUEIRA IMPORTAR ISSO PARA O APP)`;
    return str;
  }

  public async parseStringToList(str: string): Promise<ShoppingCart> {
    try {
      const shoppingCartImport = new ShoppingCart();
      const strTitleContent = str.replace(/\n/g, '').split('===')[0];
      if (strTitleContent && strTitleContent.includes('Lista: ')) {
        shoppingCartImport.name = strTitleContent.replace('Lista: ', '').trim();
      } else {
        shoppingCartImport.name = `Lista Importada ${new Date().toISOString()}`;
      }

      const strListContent = str.replace(/\n/g, '').split('===')[1];
      if (strListContent) {
        const itemList = strListContent.trim().split(';').filter((strCont) => strCont.includes('-'));
        if (itemList.length > 0) {
          itemList.forEach((item) => {
            const cartItem: ShoppingCartItem = {
              itemName: '',
              quantity: null,
              value: null
            };

            let itemString = '';
            if (item.includes('×')) {
              const quantityString = item.split('× ')[0].trim();
              if (quantityString) {
                cartItem.quantity = parseFloat(quantityString.split('- ')[1].trim());
              }

              itemString = item.split('×')[1].trim();
            } else {
              itemString = item.split('-')[1].trim();
            }

            let currencyString = '';
            if (itemString.includes(': R$')) {
              const itemStrArr = itemString.split(': R$');
              itemString = itemStrArr[0].trim();
              currencyString = itemStrArr[1].split(' cada')[0].trim();
              cartItem.value = parseFloat(currencyString.split('.').join('').replace(',', '.'));
            }

            cartItem.itemName = itemString;
            shoppingCartImport.cartItems.push(cartItem);
          });
        }

        return shoppingCartImport;
      } else {
        throw new Error(`Erro ao tentar importar esta Lista de Compras.
        Verifique o texto copiado e garanta que a mensagem está da forma como mostrada no exemplo.`);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Erro ao tentar importar esta Lista de Compras.
      Verifique o texto copiado e garanta que a mensagem está da forma como mostrada no exemplo.`);
    }
  }

  public async shareShoppingList(shoppingCart: ShoppingCart) {
    try {
      const shoppingListsString = this.parseListToString(shoppingCart);
      if (this.platform.is('capacitor')) {
        return this.socialSharing.share(shoppingListsString);
      } else {
        return shoppingListsString;
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}
