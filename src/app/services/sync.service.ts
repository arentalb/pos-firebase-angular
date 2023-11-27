import { Injectable } from '@angular/core';
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
    private dexieService :DexieService ,
    private onlineService :OnlineService,
    private router : Router,
    private dataErrorService :DataErrorService
  ) { }


 async startSync(){
   console.log("start syncing ")
   const products = await this.dexieService.getAllProductsForSyncing();

   if (products.length > 0) {
     await this.syncProductsSequentially(products);
   } else {
     console.log("no product for syncing ");
   }

  //  await this.dexieService.getAllProductsForSyncing().then((products:Product[])=>{
  //
  //     if (products.length >0){
  //       for ( let pro of products){
  //         console.log(pro.key)
  //           this.onlineService.syncNewProduct(pro).subscribe(async () => {
  //               console.log("new product synced ")
  //               console.log(pro)
  //               await this.dexieService.removeProductById(pro.key).then((key) => {
  //                 console.log(" product deleted with the key of " + key)
  //               })
  //
  //             },
  //         (error) => {
  //                this.handleSyncError(pro, error);
  //           console.error('Error in subscription:');
  //         }
  //         )
  //       }
  //     }else {
  //       console.log("no product for syncing ")
  //
  //     }
  //
  // })
  }
  async syncProductsSequentially(products: Product[], index: number = 0) {
    if (index < products.length) {
      const pro = products[index];
      console.log(pro.key);

      try {
        await this.onlineService.syncNewProduct(pro).toPromise();
        console.log("new product synced ");
        console.log(pro);

        await this.dexieService.removeProductById(pro.key).then(()=>{
          products.splice(index, 1);

        });
        console.log("product deleted with the key of " + pro.key);
      } catch (error) {
       await this.handleSyncError(pro, error).then(()=>{
         products.splice(index, 1);

       });
        console.error('Error in subscription:');
        // Log the error and continue with the next product
      }

      // Recursively call the function for the next product
      await this.syncProductsSequentially(products, index + 1);
    }
  }

  async handleSyncError(product: Product, error: any) {
   await this.dexieService.addProductToErrorTableAndRemoveProductById(product).then((key)=>{
      console.log(" product deleted with the key of " + key )
     this.router.navigate(['admin','error-data'])
     console.log('Handling sync error for product:', product);
    })




    // You can add logic here to handle the error, mark the product as invalid,
    // and display an error message or highlight the invalid input.

    // this.dataErrorService.productsThatHasError.next(product)


    // For example, you can store the error information in a variable and use it in the component.

  }

}
