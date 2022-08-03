import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertController, IonContent, IonInput } from '@ionic/angular';
import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';
import { StorageService } from 'src/app/services/storage.service';
import { ToastUtils } from 'src/app/utils/toast';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChildren('itemNameInput') inputNameInputList: QueryList<IonInput>;
  @ViewChild('homeContent') public homeContent: IonContent;

  public shoppingList: ShoppingCartItem[] = [];

  constructor(
      private storageService: StorageService,
      private toast: ToastUtils,
      private alertCtrl: AlertController
    ) { }

  ngOnInit() {
    this.loadList();
  }

  public addItem() {
    this.shoppingList.push({
      itemName: '',
      quantity: null,
      value: null
    });

    setTimeout( async () => {
      const ionInputArray = this.inputNameInputList.toArray();
      await this.homeContent.scrollToBottom();
      await ionInputArray[ionInputArray.length - 1].setFocus();
      await this.saveList();
    }, 50);
  }

  public removeItem(index: number) {
    this.shoppingList.splice(index, 1);
    this.saveList();
  }

  public async removeAll() {
    const alert = await this.alertCtrl.create({
      header: 'Limpar a Lista?',
      subHeader: 'Deseja limpar a lista toda removendo todos os produtos? Esta ação não pode ser desfeita!',
      mode: 'ios',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      },{
        text: 'Sim',
        handler: () => {
          this.saveList(true);
        }
      }]
    })

    alert.present();
  }

  private async loadList() {
    try {
      const shoppingList: ShoppingCartItem[] = await this.storageService.get('shoppingList');
      shoppingList.map((item) => {
        this.shoppingList.push(item);
      })
    } catch (error) {
      console.error(error);
      this.toast.display(`Error: ${error}`);
    }
  }

  private async saveList(clearList = false) {
    try {
      if (clearList) {
        this.shoppingList = [];
      }
      await this.storageService.set('shoppingList', this.shoppingList);
    } catch (error) {
      console.error(error);
      this.toast.display(`Error: ${error}`);
    }
  }

  public getTotal(): number {
    let totalValue = 0;
    if (this.shoppingList && this.shoppingList.length > 0) {
      this.shoppingList.map((item) => {
        const itemQuantity = (item.quantity > 0 ? item.quantity : 0);
        const itemValue = (item.value > 0 ? item.value : 0);
        totalValue += (itemValue * itemQuantity);
      });
    }

    return totalValue;
  }
}
