import { ShoppingCartItem } from './shopping-cart-item';

export class ShoppingCart {
  index?: number;
  name: string;
  edit?: boolean;
  cartItems?: ShoppingCartItem[];

  constructor(shoppingCart?: any) {
    this.index = shoppingCart?.index || null;
    this.name = shoppingCart?.name || null;
    this.cartItems = shoppingCart?.cartItems || [];
    this.edit = false;
  }

  public getCartTotal(): number {
    if (this.cartItems.length > 0) {
      if (this.cartItems.length === 1) {
        return (this.cartItems[0].value * this.cartItems[0].quantity);
      }

      return this.cartItems.map((item) => {
        const itemValue = item.value > 0 ? item.value : 0;
        return itemValue * item.quantity;
      }).reduce((prev, curr) => prev + curr);
    } else {
      return 0;
    }
  }

  public getCartLength(): number {
    if (this.cartItems) {
      return this.cartItems.length || 0;
    }

    return 0;
  }
}
