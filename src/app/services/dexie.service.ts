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

  constructor() {
    super("products");
    this.version(3).stores({
      onlineProducts: 'key,name,category,quantity,basePrice,salePrice,imageUrl',
      offlineProducts: 'key,name,category,quantity,basePrice,salePrice,image',

      //...other tables goes here...
    });
  }

  async clearSavedProducts(){
  await  this.onlineProducts.clear()
    console.log("all onlineProducts is removed ")
  }
  async saveProducts(products: Product[]) {
    await this.clearSavedProducts()
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
}


