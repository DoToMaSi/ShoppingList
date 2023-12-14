import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class ToastUtils {

  constructor(private toastCtrl: ToastController) { }

  public async display(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: msg.length * 60,
      position: 'bottom',
    });

    toast.present();
  }
}
