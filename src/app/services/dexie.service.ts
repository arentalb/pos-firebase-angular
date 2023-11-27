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
  soldProducts: Dexie.Table<{ key :string , sellQuantity:number } , number >;


  constructor() {
    super("products");
    this.version(5).stores({
      onlineProducts: 'key,name,category,quantity,basePrice,salePrice,imageUrl',
      offlineProducts: 'key,name,category,quantity,basePrice,salePrice,image',
      errorProducts: 'key,name,category,quantity,basePrice,salePrice,image',
      soldProducts: '++id , key,sellQuantity',

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

  async subtractPcsOfSoldProduct(key: string, sellQuantity: number): Promise<void> {
    try {
      // Retrieve the product from the onlineProducts table
      const product = await this.onlineProducts.get(key);

      if (product) {
        // Subtract the sold quantity
        product.quantity -= sellQuantity;

        // Update the product in the onlineProducts table
        await this.onlineProducts.update(key, { quantity: product.quantity });
        await this.soldProducts.add({key: key, sellQuantity: sellQuantity});
      } else {
        // Handle the case where the product with the given key is not found
        throw new Error(`Product with key ${key} not found.`);
      }
    } catch (error) {
      // Handle errors appropriately (e.g., log or rethrow)
      console.error('Error subtracting sold quantity:', error);
      throw error;
    }
  }

  async getAllSoldProducts() {
    return   this.soldProducts.toArray()

  }

  deleteSoldProduct(key: string){
    return this.soldProducts.where('key').equals(key).delete();

  }
}


