import { ListService } from 'src/app/services/list.service';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AlertController, IonContent, IonInput, ItemReorderEventDetail, NavController, Platform, ToastController } from '@ionic/angular';

import { ToastUtils } from 'src/app/utils/toast';
import { ShoppingCart } from 'src/app/models/shopping-cart';
import { ActivatedRoute } from '@angular/router';
import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
})
export class ShoppingListPage implements OnInit, AfterViewInit {

  @ViewChildren('itemNameInput') public inputNameInputList: QueryList<IonInput>;
  @ViewChild('homeContent') public homeContent: IonContent;

  public shoppingCart: ShoppingCart;
  public removeToast: HTMLIonToastElement;

  constructor(
    private ref: ChangeDetectorRef,
    private listService: ListService,
    private toast: ToastUtils,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private platform: Platform,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.loadList();
  }

  public addItem() {
    this.shoppingCart.cartItems.push({
      itemName: '',
      quantity: null,
      value: null
    });

    setTimeout( async () => {
      const ionInputArray = this.inputNameInputList.toArray();
      await this.saveList();
      await ionInputArray[ionInputArray.length - 1].setFocus();
    }, 150);
  }

  public async removeItem(index: number) {
    const removedItem = this.shoppingCart.cartItems.splice(index, 1);
    this.saveList();

    if (this.removeToast) {
      this.removeToast.dismiss();
    }

    this.removeToast = await this.toastCtrl.create({
      message: `${removedItem[0].itemName} removido`,
      duration: 1200,
      buttons: [{
        text: 'Desfazer?',
        handler: () => {
          this.shoppingCart.cartItems.splice(index, 0, removedItem[0]);
          this.saveList();
        }
      }]
    });

    this.removeToast.present();

    this.removeToast.onDidDismiss().then(() => {
      this.removeToast = null;
    })
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
    });

    alert.present();
  }

  public inputChange(item?: ShoppingCartItem) {
    if (item && item.value) {
      item.value = parseFloat(item.value.toFixed(2));
    }
    this.saveList();
  }

  public getTotal(): number {
    let totalValue = 0;
    if (this.shoppingCart.cartItems && this.shoppingCart.cartItems.length > 0) {
      this.shoppingCart.cartItems.map((item) => {
        const itemQuantity = (item.quantity > 0 ? item.quantity : 0);
        const itemValue = (item.value > 0 ? item.value : 0);
        totalValue += (itemValue * itemQuantity);
      });
    }

    return totalValue;
  }

  public async handleReorder(reorderEvent: CustomEvent<ItemReorderEventDetail>) {
    reorderEvent.detail.complete(this.shoppingCart.cartItems);
    await this.saveList();
  }

  public async copyItem(item: ShoppingCartItem, index: number) {
    const newItem = JSON.parse(JSON.stringify(item));
    this.shoppingCart.cartItems.splice(index, 0, newItem);
    await this.saveList();
  }

  public async shareShoppingList() {
    if (this.platform.is('mobile')) {
      try {
        await this.listService.shareShoppingList(this.shoppingCart);
      } catch (error) {
        console.error(error);
        this.toast.display('Erro ao tentar compartilhar a lista de Compras');
      } finally {
        this.ref.detectChanges();
      }
    } else {
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = this.listService.parseListToString(this.shoppingCart);
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);

      this.ref.detectChanges();
      this.toast.display('Copiada Lista de Compras!');
    }
  }

  private async loadList() {
    try {
      const index = parseInt(this.route.snapshot.paramMap.get('id'), 10);
      this.shoppingCart = this.listService.getCartById(index);


      if (!this.shoppingCart) {
        this.navCtrl.navigateRoot('shopping-carts');
      }
    } catch (error) {
      console.error(error);
      this.toast.display(`Error: ${error}`);
    }
  }

  private async saveList(clearList = false) {
    try {
      if (clearList) {
        this.shoppingCart.cartItems = [];
      }

      await this.listService.saveShoppingCart(this.shoppingCart);
    } catch (error) {
      console.error(error);
      this.toast.display(`Error: ${error}`);
    }
  }
}
