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
        path: 'course',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/course/course.module').then(m => m.CoursePageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/course',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/course',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
