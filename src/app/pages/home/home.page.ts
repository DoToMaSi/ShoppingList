import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AlertController, IonContent, IonInput, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';

import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';
import { StorageService } from 'src/app/services/storage.service';
import { ToastUtils } from 'src/app/utils/toast';
import { ShoppingCart } from 'src/app/models/shopping-cart';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChildren('inputNameInputList') inputNameInputList: QueryList<IonInput>;
  // @ViewChild('inputNameInputList') inputNameInputList: IonInput;
  @ViewChild('homeContent') public homeContent: IonContent;

  public newListFormOpen = new BehaviorSubject(false);
  public newListForm = new FormGroup({
    name: new FormControl('')
  });
  public shoppingCart: ShoppingCart;
  public shoppingList: ShoppingCartItem[] = [];

  constructor(
      private listService: ListService,
      private toast: ToastUtils,
      private alertCtrl: AlertController,
      private router: Router,
      private platform: Platform
    ) { }

  public ngOnInit() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      App.exitApp();
    });
  }

  public ngAfterViewInit() {}

  public newListButton() {
    this.newListFormOpen.next(true);
    this.newListForm.reset();
  }

  public closeListForm() {
    this.newListFormOpen.next(false);
    this.newListForm.reset();
  }

  public getShoppingCartList() {
    if (this.listService.getShoppingCarts()) {
      return this.listService.getShoppingCarts().reverse();
    }
  }

  public async saveNewList() {
    this.newListFormOpen.next(false);
    const newListForm = this.newListForm.value as { name: string };

    if (newListForm.name.trim()) {
      try {
        const shoppingCart = await this.listService.addShoppingCart(newListForm);
        this.listService.loadShoppingCarts();
        this.accessList(shoppingCart);
      } catch (error) {
        console.error(error);
        this.toast.display(`Error: ${error}`);
      }
    } else {
      this.closeListForm();
    }
  }

  public async accessList(shoppingCart: ShoppingCart) {
    this.closeListForm();
    this.router.navigate([`/shopping-list/${shoppingCart.index}`]);
  }

  public async copyList(shoppingCart: ShoppingCart) {
    this.closeListForm();
    const alert = await this.alertCtrl.create({
      header: `Duplicar a lista ${shoppingCart.name}?`,
      subHeader: 'Deseja duplicar esta lista de compras?',
      mode: 'ios',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      },{
        text: 'Sim',
        handler: async () => {
          try {
            await this.listService.copyShoppingCart(shoppingCart);
            this.toast.display('Lista Duplicada com Sucesso');
            this.listService.loadShoppingCarts();
          } catch (error) {
            console.error(error);
            this.toast.display(`ERRO: ${error}`);
          }
        }
      }]
    })

    alert.present();
  }

  public async removeList(shoppingCart: ShoppingCart) {
    this.closeListForm();
    const alert = await this.alertCtrl.create({
      header: `Remover a lista ${shoppingCart.name}?`,
      subHeader: 'Deseja remover esta lista de compras? Esta ação não pode ser desfeita!',
      mode: 'ios',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      },{
        text: 'Sim',
        handler: async () => {
          try {
            await this.listService.removeShoppingCart(shoppingCart);
            this.toast.display('Lista Removida com Sucesso');
            this.listService.loadShoppingCarts();
          } catch (error) {
            console.error(error);
            this.toast.display(`ERRO: ${error}`);
          }
        }
      }]
    })

    alert.present();
  }

  public async clickEditInput(shoppingCart: ShoppingCart, index: number) {
    shoppingCart.edit = true;

    setTimeout( async () => {
      if (this.inputNameInputList) {
        const ionInputArray = this.inputNameInputList.toArray();
        await ionInputArray[index].setFocus();
      }
    }, 50);
  }

  public async saveEditInput(shoppingCart: ShoppingCart) {
    await this.listService.saveShoppingCart(shoppingCart);
    shoppingCart.edit = false;
  }
}
