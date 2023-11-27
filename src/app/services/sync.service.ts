import {Injectable} from '@angular/core';
import {DexieService} from "./dexie.service";
import {OnlineService} from "./online.service";
import {Product} from "../models/product";
import {Router} from "@angular/router";
import {DataErrorService} from "./data-error.service";

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  constructor(
    private dexieService: DexieService,
    private onlineService: OnlineService,
    private router: Router,
  ) {
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  async startSync() {
    console.log(`service (SyncService) - method (startSync) `)
    if (this.isOnline()){
      console.log(`service (SyncService) - method (startSync) - if block `)

      const products = await this.dexieService.getAllProductsForSyncing();

      if (products.length > 0) {
        console.log(`service (SyncService) - method (startSync) - if block`)
        await this.syncProductsSequentially(products);
      } else {
        console.log(`service (SyncService) - method (startSync) - else block`)
      }
    }else {
      console.log(`service (SyncService) - method (startSync) - else block `)

    }

  }

  async syncProductsSequentially(products: Product[], index: number = 0) {
    console.log(`service (SyncService) - method (syncProductsSequentially) `)

    if (index < products.length) {
      console.log(`service (SyncService) - method (syncProductsSequentially) - if block - ${products[index].name}`)

      const pro = products[index];

      try {
        await this.onlineService.syncNewProduct(pro).toPromise();
        await this.dexieService.removeProductById(pro.key).then(() => {
          products.splice(index, 1);
        });

      } catch (error) {
        console.log(`service (SyncService) - method (syncProductsSequentially) - error - ${products[index].name}`)

        await this.handleSyncError(pro, error).then(() => {
          products.splice(index, 1);

        });

      }

      await this.syncProductsSequentially(products, index + 1);
    }
  }

  async handleSyncError(product: Product, error: any) {
    console.log(`service (SyncService) - method (handleSyncError) - ${product.name}`)

    await this.dexieService.addProductToErrorTableAndRemoveProductById(product).then((key) => {
      this.router.navigate(['admin', 'error-data'])
    })



  }

}
