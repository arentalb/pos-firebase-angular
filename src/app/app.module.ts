import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {HeaderComponent} from "./header/header.component";

import { HomeComponent } from './home/home.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ProductFormComponent } from './inventory/product-form/product-form.component';
import { ProductsComponent } from './inventory/products/products.component';
import { CircleLoadingComponent } from './loadings/circle-loading/circle-loading.component';
import { SellComponent } from './sell/sell.component';
import { SoldProductsComponent } from './sell/sold-products/sold-products.component';
import { AvailableProductsComponent } from './sell/available-products/available-products.component';
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    InventoryComponent,
    ProductFormComponent,
    ProductsComponent,
    CircleLoadingComponent,
    SellComponent,
    SoldProductsComponent,
    AvailableProductsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
