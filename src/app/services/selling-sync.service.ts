import {Injectable} from '@angular/core';
import {DexieService} from "./dexie.service";
import {OnlineService} from "./online.service";

@Injectable({
  providedIn: 'root'
})
export class SellingSyncService {

  constructor(private dexieService: DexieService, private onlineService: OnlineService) {
  }

  isOnline(): boolean {
    return navigator.onLine;
  }
  async startSync() {

    console.log(`service (SellingSyncService) - method (startSync) `)

    if (this.isOnline()) {
      console.log(`service (SellingSyncService) - method (startSync) - if block`)

      const products = await this.dexieService.getAllSoldProducts();

      if (products.length > 0) {
        console.log(`service (SellingSyncService) - method (startSync) - if block`)

        await this.syncProductsSequentially(products);
      } else {
        console.log(`service (SellingSyncService) - method (startSync) - else block `)

      }
    }else {
      console.log(`service (SellingSyncService) - method (startSync) - else block`)

    }


  }

  async syncProductsSequentially(data: { key: string, sellQuantity: number } [], index: number = 0) {
    console.log(`service (SellingSyncService) - method (syncProductsSequentially)  `)

    if (index < data.length) {
      console.log(`service (SellingSyncService) - method (syncProductsSequentially) - if block `)
      const pro = data[index];
      try {
        await this.onlineService.subtractPcsOfSoldProduct(pro.key, pro.sellQuantity).toPromise();
        await this.dexieService.deleteSoldProduct(pro.key)
      } catch (error) {
        console.log(`service (SellingSyncService) - method (syncProductsSequentially) - error `)
      }
      await this.syncProductsSequentially(data, index + 1);
    }
  }
}
