import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectorPageComponent } from './pages/selector-page/selector-page.component';

const routes: Routes = [
  {
    path:'',
    component: SelectorPageComponent,
    // Si se van a poner mas paginas se haria asi, sin poner el component
    // children:[
    //   { path: 'selector', component: SelectorPageComponent },
    //   { path: '**', redirectTo: 'selector' }
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountriesRoutingModule { }
