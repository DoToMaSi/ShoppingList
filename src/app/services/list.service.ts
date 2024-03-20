import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { StorageService } from './storage.service';
import { CurrencyPipe } from '@angular/common';
import { List } from '../models/list.model';
import { IListItem } from '../models/list-item.model';

@Injectable({
  providedIn: 'root'
})

export class ListService {

  private lists: List[];

  constructor(
    private storageService: StorageService,
    private socialSharing: SocialSharing,
    private platform: Platform,
    private currencyPipe: CurrencyPipe
  ) {
    this.loadLists();
  }

  public getLists() {
    return this.lists;
  }

  public getListById(index: number) {
    if (this.lists) {
      return this.lists.find((list) => list.index === index);
    } else {
      return null;
    }
  }

  public async addList(list: List) {
    this.lists.unshift(list);

    this.lists.forEach((list, index) => {
      list.index = (index + 1);
    });

    await this.saveList();
    return list;
  }

  public async copyList(list: List, index: number) {
    const newList = new List(JSON.parse(JSON.stringify({ ...list })));
    list.listName = `${list.listName} 2`;
    this.lists.splice(index, 0, newList);

    this.lists.forEach((listItem, idx) => {
      listItem.index = (idx + 1);
    });

    await this.saveList();
    return list;
  }

  public async loadLists() {
    try {
      const lists = await this.storageService.get('lists') as any[];
      this.lists = [];

      if (lists && lists.length > 0) {
        console.log(lists);
        lists.forEach((list, index) => {
          list.index = (index + 1);
          this.lists.push(new List(list));
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  public async removeList(list?: List) {
    if (list) {
      const cartIndex = this.lists.findIndex((cartList) => cartList.index === list.index);
      this.lists.splice(cartIndex, 1);

      return await this.storageService.set('lists', this.lists);
    }
  }

  public async saveList(list?: List) {
    if (list) {
      const index = this.lists.findIndex((listItem) => listItem.index === list.index);
      if (index !== -1) {
        this.lists[index] = list;
      }
    }

    return await this.storageService.set('lists', this.lists);
  }

  public parseListToString(list: List): string {
    let str = `Lista: ${list.listName}\n\n===\n`;
    if (list.items.length > 0) {
      list.items.forEach((listItem, index) => {
        if (listItem.itemName) {
          str += `\n- `;
          if (listItem.quantity) {
            str += `${listItem.quantity}× `;
          }
          str += `${listItem.itemName}`;
          if (listItem.value) {
            str += `: ${this.currencyPipe.transform(listItem.value, 'BRL', 'R$', '1.2-2')} cada`;
          }
          str += `;`;
        }

        if (index === (list.items.length - 1)) {
          str += `\n`;
        }
      });

      if (list.getCartTotal()) {
        str += `\nVALOR TOTAL: ${this.currencyPipe.transform(list.getCartTotal(), 'BRL', 'R$', '1.2-2')}\n`;
      }
    } else {
      str += `\n[Esta lista está vazia]\n`;
    }

    str += `\n===\n\nLista gerada pelo app Shopping Cart. (NÃO EDITE ESTA MENSAGEM CASO VOCÊ QUEIRA IMPORTAR ISSO PARA O APP)`;
    return str;
  }

  public async parseStringToList(str: string): Promise<List> {
    try {
      const listImport = new List();
      const strTitleContent = str.replace(/\n/g, '').split('===')[0];
      if (strTitleContent && strTitleContent.includes('Lista: ')) {
        listImport.listName = strTitleContent.replace('Lista: ', '').trim();
      } else {
        listImport.listName = `Lista Importada ${new Date().toISOString()}`;
      }

      const strListContent = str.replace(/\n/g, '').split('===')[1];
      if (strListContent) {
        const itemList = strListContent.trim().split(';').filter((strCont) => strCont.includes('-'));
        if (itemList.length > 0) {
          itemList.forEach((item) => {
            const listItem: IListItem = {
              itemName: '',
              quantity: null,
              value: null
            };

            let itemString = '';
            if (item.includes('×')) {
              const quantityString = item.split('× ')[0].trim();
              if (quantityString) {
                listItem.quantity = parseFloat(quantityString.split('- ')[1].trim());
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
              listItem.value = parseFloat(currencyString.split('.').join('').replace(',', '.'));
            }

            listItem.itemName = itemString;
            listImport.items.push(listItem);
          });
        }

        return listImport;
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

  public async shareShoppingList(list: List) {
    try {
      const listsString = this.parseListToString(list);
      if (this.platform.is('capacitor')) {
        return this.socialSharing.share(listsString);
      } else {
        return listsString;
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}
