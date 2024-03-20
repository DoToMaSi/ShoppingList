import { ChangeDetectorRef, Component, Optional } from '@angular/core';
import { AlertController, ItemReorderEventDetail, ModalController, NavController, Platform } from '@ionic/angular';
import { ListService } from 'src/app/services/list.service';
import { ListFormComponent } from './list-form/list-form.component';
import { List } from 'src/app/models/list.model';
import { ToastUtils } from 'src/app/utils/toast';
import { Router } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular/common';

@Component({
  templateUrl: 'lists.component.html',
  styleUrl: './lists.component.scss'
})

export class ListsComponent {
  constructor(
    private listService: ListService,
    private modalCtrl: ModalController,
    private toast: ToastUtils,
    private alertCtrl: AlertController,
    private router: Router,
    private platform: Platform,
    private ref: ChangeDetectorRef,
    private navCtrl: NavController,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) { }

  get lists() {
    return this.listService.getLists();
  }

  async createNewList() {
    const modal = await this.modalCtrl.create({
      component: ListFormComponent,
      backdropDismiss: true
    })

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(data);
      console.log('confirm!');
    }
  }

  async editList(list: List, index: number) {
    const modal = await this.modalCtrl.create({
      component: ListFormComponent,
      componentProps: {
        list,
        index
      },
      backdropDismiss: true
    })

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(data);
      console.log('confirm!');
    }
  }


  public async accessList(list: List) {
    this.router.navigate([`/shopping-list/${list.index}`]);
  }

  public async copyList(list: List, index: number) {
    const alert = await this.alertCtrl.create({
      header: `Duplicar a lista ${list.listName}?`,
      subHeader: 'Deseja duplicar esta lista de compras?',
      mode: 'ios',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      }, {
        text: 'Sim',
        handler: async () => {
          try {
            await this.listService.copyList(list, index);
            this.toast.display('Lista Duplicada com Sucesso');
            this.listService.loadLists();
            this.ref.detectChanges();
          } catch (error) {
            console.error(error);
            this.toast.display(`ERRO: ${error}`);
          }
        }
      }]
    });

    alert.present();
    this.ref.detectChanges();
  }

  public async removeList(list: List) {
    const alert = await this.alertCtrl.create({
      header: `Remover a lista ${list.listName}?`,
      subHeader: 'Deseja remover esta lista de compras? Esta ação não pode ser desfeita!',
      mode: 'ios',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      }, {
        text: 'Sim',
        handler: async () => {
          try {
            await this.listService.removeList(list);
            this.toast.display('Lista Removida com Sucesso');
            this.listService.loadLists();
            this.ref.detectChanges();
          } catch (error) {
            console.error(error);
            this.toast.display(`ERRO: ${error}`);
          }
        }
      }]
    });

    alert.present();
  }

  public async handleReorder(reorderEvent: CustomEvent<ItemReorderEventDetail>) {
    reorderEvent.detail.complete(this.lists);
    await this.listService.saveList();
  }

  public async shareList(list: List) {
    if (this.platform.is('capacitor')) {
      try {
        await this.listService.shareShoppingList(list);
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
      selBox.value = this.listService.parseListToString(list);
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);

      this.ref.detectChanges();
      this.toast.display('Copiada Lista de Compras!');
    }
  }

  public importCart() {
    this.router.navigate(['/shopping-carts/import-cart']);
  }
}
