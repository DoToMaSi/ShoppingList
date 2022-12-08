import { ListService } from 'src/app/services/list.service';
import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AlertController, IonContent, IonInput, ItemReorderEventDetail, NavController, Platform } from '@ionic/angular';

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

  constructor(
    private listService: ListService,
    private toast: ToastUtils,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() { }

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

  public removeItem(index: number) {
    this.shoppingCart.cartItems.splice(index, 1);
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
    });

    alert.present();
  }

  public inputChange() {
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

  private async loadList() {
    try {
      const index = parseInt(this.route.snapshot.paramMap.get('id'), 10);
      this.shoppingCart = this.listService.getCartById(index);


      if (!this.shoppingCart) {
        this.navCtrl.navigateRoot('home');
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
