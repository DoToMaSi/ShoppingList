import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'lists',
    pathMatch: 'full'
  },
  {
    path: 'lists',
    loadChildren: () => import('./pages/lists/lists.module').then(m => m.ListsModule)
  },
  // {
  //   path: 'shopping-list',
  //   redirectTo: 'shopping-carts',
  //   pathMatch: 'full'
  // },
  // {
  //   path: 'shopping-list/:id',
  //   loadChildren: () => import('./pages/shopping-list/shopping-list.module').then( m => m.ShoppingListPageModule)
  // },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
