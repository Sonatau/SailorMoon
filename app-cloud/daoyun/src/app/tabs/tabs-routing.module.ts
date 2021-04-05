import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'mine',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/mine/mine.module').then(m => m.MinePageModule)
          }
        ]
      },
      {
        path: 'coures',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/coures/coures.module').then(m => m.CouresPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/coures',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/coures',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
