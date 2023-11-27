import { Injectable } from '@angular/core';
import {DexieService} from "./dexie.service";
import {Product} from "../models/product";
import {OnlineService} from "./online.service";

@Injectable({
  providedIn: 'root'
})
export class SellingSyncService {

  constructor(private dexieService :DexieService , private onlineService :OnlineService) { }

  async startSync(){
    console.log("start syncing ")
    const products = await this.dexieService.getAllSoldProducts();
    console.log("111111111111111")
    console.log(products)
    console.log("111111111111111")

    if (products.length > 0) {
      await this.syncProductsSequentially(products);
    } else {
      console.log("no product for syncing ");
    }

  }
  async syncProductsSequentially(data :{ key :string , sellQuantity:number } [] , index: number = 0) {
    if (index < data.length) {
      const pro = data[index];
      console.log(pro);

      try {
        await this.onlineService.subtractPcsOfSoldProduct(pro.key , pro.sellQuantity).toPromise();
        console.log("new product synced ");
        console.log(pro);

        await this.dexieService.deleteSoldProduct(pro.key)
        console.log("product deleted with the key of " + pro.key);
      } catch (error) {

        console.error('Error in subscription:');
        // Log the error and continue with the next product
      }

      // Recursively call the function for the next product
      await this.syncProductsSequentially(data, index + 1);
    }
  }
}
