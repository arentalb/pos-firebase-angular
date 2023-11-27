import {Injectable} from '@angular/core';
import {Product} from "../models/product";
import {from, Observable} from "rxjs";
import {DexieService} from "./dexie.service";
import {ImageService} from "./image.service";

@Injectable({
  providedIn: 'root'
})
export class OfflineService {

  constructor(private dexieService: DexieService, private imageService: ImageService) {
  }

  saveProductsa(products: Product[]) {
    console.log(`service (OfflineService) - method (saveProducts) `)

    this.imageService.mapProductsToBase64(products).subscribe((newproducts) => {
      products = newproducts
      this.dexieService.saveProducts(products).then((data) => {

      })
    })


  }

  saveProducts(products: Product[]) {
    console.log(`service (OfflineService) - method (saveProducts) `);

    // Get the keys of the provided products
    const productKeys = products.map((product) => product.key);

    // Check if each product already exists in Dexie
    this.dexieService.checkIfProductExistWithKey(productKeys).subscribe((existingProducts) => {

      // Extract keys of existing products
      const existingKeys = existingProducts.map((product) => product.key);

      // Filter out products that do not exist in Dexie
      const newProducts = products.filter((product) => !existingKeys.includes(product.key));

      // Map the new products to base64
      this.imageService.mapProductsToBase64(newProducts).subscribe((newProductsMapped) => {
        // Save the new products to Dexie
        this.dexieService.saveProducts(newProductsMapped).then((data) => {
          // Handle the result if needed
        });
      });
    });

  }

  getSavedProducts(): Observable<Product[]> {
    console.log(`service (OfflineService) - method (getSavedProducts) `)

    return from(this.dexieService.getSavedOnlineProducts())
  }

  addNewProductForSync(product: Product): Observable<void> {
    console.log(`service (OfflineService) - method (addNewProductForSync) - ${product.name} `)

    return this.dexieService.addNewSyncProduct(product);
  }
}
