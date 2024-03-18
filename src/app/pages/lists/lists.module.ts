import { NgModule } from '@angular/core';
import { ListsComponent } from './lists.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListRoutingModule } from './list-routing.module';

const declarations = [
  ListsComponent
];

const imports = [
  CommonModule,
  FormsModule,
  IonicModule,
  ReactiveFormsModule,
  ListRoutingModule
];

@NgModule({
  declarations,
  imports
})

export class ListsModule { }
