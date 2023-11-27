import {Injectable} from '@angular/core';
import {Product} from "../models/product";
import {from, Observable} from "rxjs";
import {DexieService} from "./dexie.service";
import {ImageService} from "./image.service";

@Injectable({
  providedIn: 'root'
})
export class OfflineService {

  constructor(private dexieservice: DexieService, private imageservice: ImageService) {
  }

  saveProducts(products: Product[]) {
    console.log(`service (OfflineService) - method (saveProducts) `)

    this.imageservice.mapProductsToBase64(products).subscribe((newproducts) => {
      products = newproducts
      this.dexieservice.saveProducts(products).then((data) => {

      })
    })


  }

  getSavedProducts(): Observable<Product[]> {
    console.log(`service (OfflineService) - method (getSavedProducts) `)

    return from(this.dexieservice.getSavedOnlineProducts())
  }

  addNewProductForSync(product: Product): Observable<void> {
    console.log(`service (OfflineService) - method (addNewProductForSync) - ${product.name} `)

    return this.dexieservice.addNewSyncProduct(product);
  }
}
