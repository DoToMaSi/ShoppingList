import { NgModule } from '@angular/core';
import { ListsComponent } from './lists.component';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListRoutingModule } from './list-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ListFormComponent } from './list-form/list-form.component';
import { CustomCurrencyDirective } from 'src/app/utils/directives/custom-currency.directive';

const declarations = [
  ListsComponent,
  ListFormComponent,
  CustomCurrencyDirective
];

const imports = [
  CommonModule,
  FormsModule,
  IonicModule,
  ReactiveFormsModule,
  ListRoutingModule,
  TranslateModule
];

const providers = [
  CurrencyPipe,
  DecimalPipe,
  CustomCurrencyDirective
]

@NgModule({
  declarations: [
    ...declarations
  ],
  imports: [
    ...imports
  ],
  providers: [
    ...providers
  ]
})

export class ListsModule { }
