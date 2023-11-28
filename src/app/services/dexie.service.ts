import {Injectable} from '@angular/core';
import Dexie from "dexie";
import {Product} from "../models/product";
import {from, Observable} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DexieService extends Dexie {

  onlineProducts: Dexie.Table<Product, string>;
  offlineProducts: Dexie.Table<Product>;
  errorProducts: Dexie.Table<Product>;
  soldProducts: Dexie.Table<{ key: string, sellQuantity: number }, number>;


  constructor() {
    console.log(`service (DexieService) - method (constructor) `)

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
    console.log(`service (DexieService) - method (saveProducts)`);

    await this.transaction('rw', this.onlineProducts, async () => {
      await this.onlineProducts.clear();
      await this.onlineProducts.bulkAdd(products);
    });
  }


  getSavedOnlineProducts(): Observable<Product[]> {
    console.log(`service (DexieService) - method (getSavedOnlineProducts) `)

    return from(this.onlineProducts.toArray());
  }

  addNewSyncProduct(product: Product): Observable<void> {
    console.log(`service (DexieService) - method (addNewSyncProduct) - ${product.name}`)

    if (!product.key) {
      product.key = new Date().getTime().toString();
    }

    return from(this.offlineProducts.add(product))
  }

  async getAllProductsForSyncing() {
    console.log(`service (DexieService) - method (getAllProductsForSyncing) `)

    return this.offlineProducts.toArray()
  }

  async removeProductById(key: string) {
    console.log(`service (DexieService) - method (removeProductById) - key ${key}`)

    return this.offlineProducts.delete(key);

  }

  async addProductToErrorTableAndRemoveProductById(product: Product) {
    console.log(`service (DexieService) - method (addProductToErrorTableAndRemoveProductById) - ${product.name}`)

    await this.offlineProducts.delete(product.key);

    return this.errorProducts.add(product)

  }

  async getErrorProducts() {
    console.log(`service (DexieService) - method (getErrorProducts) `)

    return this.errorProducts.toArray()

  }

  async deleteErrorProducts(product: Product) {
    console.log(`service (DexieService) - method (deleteErrorProducts) - ${product.name}`)

    await this.errorProducts.delete(product.key);

  }

  async subtractPcsOfSoldProduct(key: string, sellQuantity: number): Promise<void> {
    console.log(`service (DexieService) - method (subtractPcsOfSoldProduct) -  key ${key} - sellQuantity ${sellQuantity}`)

    try {
      // Retrieve the product from the onlineProducts table
      const product = await this.onlineProducts.get(key);

      if (product) {
        console.log(`service (DexieService) - method (subtractPcsOfSoldProduct) - if block - ${product.name}`)

        // Subtract the sold quantity
        product.quantity -= sellQuantity;

        // Update the product in the onlineProducts table
        await this.onlineProducts.update(key, {quantity: product.quantity});
        await this.soldProducts.add({key: key, sellQuantity: sellQuantity});
      } else {
        console.log(`service (DexieService) - method (subtractPcsOfSoldProduct) - else block - ${product.name}`)

        // Handle the case where the product with the given key is not found
        throw new Error(`error from  (DexieService) -  (subtractPcsOfSoldProduct) - ${product.name}`);
      }
    } catch (error) {
      // Handle errors appropriately (e.g., log or rethrow)
      console.log(`service (DexieService) - method (subtractPcsOfSoldProduct) - error `)

      throw error;
    }
  }

  async getAllSoldProducts() {
    console.log(`service (DexieService) - method (getAllSoldProducts)  `)

    return this.soldProducts.toArray()

  }

  deleteSoldProduct(key: string) {
    console.log(`service (DexieService) - method (deleteSoldProduct)  - key ${key}`)

    return this.soldProducts.where('key').equals(key).delete();

  }

  // checkIfProductExistWithKey(keys: string[]): Observable<Array<Product>> {
  //   return from(this.onlineProducts.where('key').anyOf(keys).toArray()).pipe(
  //     catchError((error) => {
  //       console.error('DexieService - checkIfProductExistWithKey error:', error);
  //       throw error;
  //     }),
  //   );
  // }
}


