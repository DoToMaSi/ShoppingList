import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { IList, List } from 'src/app/models/list.model';
import { ListService } from 'src/app/services/list.service';
import { CustomCurrencyDirective } from 'src/app/utils/directives/custom-currency.directive';
import { ToastUtils } from 'src/app/utils/toast';

@Component({
  selector: 'list-form',
  templateUrl: 'list-form.component.html',
  styleUrl: 'list-form.component.scss'
})

export class ListFormComponent implements OnInit {

  @Input() modal: IonModal;

  private index: number;

  listForm = new FormGroup({
    index: new FormControl(null),
    listName: new FormControl('', Validators.required),
    target: new FormControl<any>(''),
    listType: new FormControl('list', Validators.required),
    items: new FormControl([])
  });

  constructor(
    private listService: ListService,
    private alertController: AlertController,
    private translate: TranslateService,
    private toast: ToastUtils,
    private customCurrency: CustomCurrencyDirective
  ) { }

  ngOnInit(): void {
    if (this.modal.componentProps) {
      const list = this.modal.componentProps.list as List;
      const index = this.modal.componentProps.index as number;

      if (list && (index !== undefined)) {
        this.listForm.patchValue(list);
        this.listForm.get('target').setValue(
          this.customCurrency.format(list.target.toFixed(2))
        );
        this.index = index;
      }
    }
  }

  async listTypeHelpClick(ev: any) {
    ev.preventDefault();
    const alert = await this.alertController.create({
      header: this.translate.instant('SHOPPING_LIST.TYPES.LIST'),
      subHeader: this.translate.instant('SHOPPING_LIST.TYPES.HELPER'),
      message: this.translate.instant('SHOPPING_LIST.TYPES.HELPER_END'),
      buttons: [`${this.translate.instant('OK')}`]
    })

    alert.present();
  }

  async submitForm() {
    this.listForm.markAllAsTouched();

    if (this.listForm.valid) {
      const list = new List(this.listForm.value as IList);

      try {
        if (this.index >= 0) {
          await this.listService.saveList(list);
        } else {
          await this.listService.addList(list);
        }

        this.modal.dismiss(list, 'confirm');
      } catch (error) {
        this.toast.display(
          `${this.translate.instant('ERROR')}: ${this.translate.instant('SHOPPING_LIST.ERROR_SAVE')}`
        )
      }
    }
  }
}
