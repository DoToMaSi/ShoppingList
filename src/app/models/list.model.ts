import { IListItem } from './list-item.model';

export interface IList {
  index?: number;
  listName: string;
  target: string | number;
  listType: 'list' | 'cart';
  items: IListItem[];
}

export class List implements IList {
  index?: number;
  listName: string;
  target: number;
  listType: 'list' | 'cart';
  items: IListItem[];

  constructor(list?: List | IList) {
    this.index = list?.index || null;
    this.listName = list?.listName || '';

    if (typeof (list?.target) === 'string') {
      this.target = list?.target ? ((parseFloat(list?.target.replace(/[\D]/g, ''))) / 100) : 0;
    } else {
      this.target = list?.target || null;
    }

    this.listType = list?.listType || 'list';
    this.items = list?.items || [];
  }

  public getCartTotal(): number {
    if (this.items.length > 0) {
      if (this.items.length === 1) {
        return (this.items[0].value * this.items[0].quantity);
      }

      return this.items.map((item) => {
        const itemValue = item.value > 0 ? item.value : 0;
        return itemValue * item.quantity;
      }).reduce((prev, curr) => prev + curr);
    } else {
      return 0;
    }
  }

  public getCartLength(): number {
    if (this.items) {
      return this.items.length || 0;
    }

    return 0;
  }
}
