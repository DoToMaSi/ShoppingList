import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ListService } from 'src/app/services/list.service';
import { ListFormComponent } from './list-form/list-form.component';

@Component({
  templateUrl: 'lists.component.html',
  styleUrl: './lists.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListsComponent {
  constructor(
    private listService: ListService,
    private modalCtrl: ModalController
  ) { }

  get shoppingLists() {
    return this.listService.getShoppingCarts();
  }

  async createNewList() {
    const modal = await this.modalCtrl.create({
      component: ListFormComponent
    })

    modal.present().then(() => {
      console.log('modal open');
    })
  }
}
