import { NgModule } from '@angular/core';
import { ListsComponent } from './lists.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListRoutingModule } from './list-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ListFormComponent } from './list-form/list-form.component';

const declarations = [
  ListsComponent,
  ListFormComponent
];

const imports = [
  CommonModule,
  FormsModule,
  IonicModule,
  ReactiveFormsModule,
  ListRoutingModule,
  TranslateModule
];

@NgModule({
  declarations: [
    ...declarations
  ],
  imports: [
    ...imports
  ]
})

export class ListsModule { }
