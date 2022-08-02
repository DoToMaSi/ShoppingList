import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { ToastUtils } from 'src/app/utils/toast';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('listFormInput') public listFormInput: IonInput;

  public listForm = new FormGroup({
    name: new FormControl('')
  });
  public openForm = false;

  constructor(private toast: ToastUtils) { }

  ngOnInit() { }

  public async openFormEvent() {
    this.openForm = true;
    await this.listFormInput.setFocus();
  }

  public submit() {
    const listForm = this.listForm.value;

    if (listForm.name) {
      this.toast.display('Lista Criada!');
    }
    this.openForm = false;
  }
}
