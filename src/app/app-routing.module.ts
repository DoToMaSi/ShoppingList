import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'shopping-carts',
    pathMatch: 'full'
  },
  {
    path: 'shopping-carts',
    loadChildren: () => import('./pages/shopping-carts/shopping-carts.module').then( m => m.ShoppingCartsPageModule)
  },
  {
    path: 'shopping-list',
    redirectTo: 'shopping-carts',
    pathMatch: 'full'
  },
  {
    path: 'shopping-list/:id',
    loadChildren: () => import('./pages/shopping-list/shopping-list.module').then( m => m.ShoppingListPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
