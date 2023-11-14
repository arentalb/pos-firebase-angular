import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {InventoryComponent} from "./inventory/inventory.component";
import {SellComponent} from "./sell/sell.component";


const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'admin' ,children :[
      { path: 'inventory', component: InventoryComponent },
    ]},

  { path: 'user' ,children :[
      { path: 'sell', component: SellComponent },
    ] },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule { }
