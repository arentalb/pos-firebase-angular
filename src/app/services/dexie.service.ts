import { Injectable } from '@angular/core';
import Dexie from "dexie";
import {Product} from "../models/product";
import {from, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DexieService extends Dexie{

  onlineProducts: Dexie.Table<Product , string>;
  offlineProducts: Dexie.Table<Product>;
  errorProducts: Dexie.Table<Product>;

  constructor() {
    super("products");
    this.version(4).stores({
      onlineProducts: 'key,name,category,quantity,basePrice,salePrice,imageUrl',
      offlineProducts: 'key,name,category,quantity,basePrice,salePrice,image',
      errorProducts: 'key,name,category,quantity,basePrice,salePrice,image',

      //...other tables goes here...
    });
  }

  async saveProducts(products: Product[]) {
    await  this.onlineProducts.clear()
    await this.onlineProducts.bulkAdd(products)


  }

  getSavedOnlineProducts() :Observable<Product[]>{
    console.log("newest saved products fetched  ")

    return from(this.onlineProducts.toArray());
  }

  addNewSyncProduct(product: Product) :Observable<void>{
    if (!product.key) {
      product.key = new Date().getTime().toString();
    }

    return  from(this.offlineProducts.add(product))
  }

  async getAllProductsForSyncing() {
      return    this.offlineProducts.toArray()
  }

  async removeProductById(key: string) {
    return  this.offlineProducts.delete(key);

  }
  async  addProductToErrorTableAndRemoveProductById(product :Product) {
    await  this.offlineProducts.delete(product.key);

    return  this.errorProducts.add(product)

  }

  async  getErrorProducts (){
   return   this.errorProducts.toArray()

  }

  async deleteErrorProducts(product: Product) {
    await  this.errorProducts.delete(product.key);

  }
}


