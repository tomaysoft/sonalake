import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListViewComponent } from './components/list-view/list-view.component';
import { EditComponent } from './components/edit/edit.component';

const routes: Routes = [
  {
    path: 'edit/:id',
    component: EditComponent
  }, {
    path: 'edit',
    component: EditComponent
  }, {
    path: '',
    component: ListViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
