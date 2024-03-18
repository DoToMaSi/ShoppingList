import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ListService } from 'src/app/services/list.service';
import { ToastUtils } from 'src/app/utils/toast';

@Component({
  templateUrl: './import-cart.page.html',
  styleUrls: ['./import-cart.page.scss'],
})
export class ImportCartPage implements OnInit {

  public inputTextList = '';

  constructor(
    private listService: ListService,
    private navCtrl: NavController,
    private toast: ToastUtils
  ) { }

  ngOnInit() {}

  public async importCart() {
    try {
      const newShoppingCart = await this.listService.parseStringToList(this.inputTextList);
      const saveCart = await this.listService.addShoppingCart(newShoppingCart);

      if (saveCart) {
        this.toast.display('Lista importada com sucesso!');
        this.navCtrl.back();
      }
    } catch (error) {
      console.error(error);
      this.toast.display(error);
    }
  }
}
