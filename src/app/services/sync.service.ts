import {Injectable, OnInit} from '@angular/core';
import {RxDBService} from "./rx-db.service";
import {concatMap, forkJoin, interval, Observable, of, tap, timer} from "rxjs";
import {Product} from "../models/product";
import {OnlineService} from "./online.service";
import {ImageService} from "./image.service";
import {switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SyncService implements OnInit{

  constructor(private rxDBService :RxDBService
              ,private onlineservice :OnlineService
              ,private imageService :ImageService
  ) { }


  ngOnInit() {
    console.log("in ngOnInit");

    // Call syncDataAndStartTimer immediately and then run it every 2 minutes
    this.syncDataAndStartTimer();
  }

  private syncDataAndStartTimer(): void {
    console.log("on syncDataAndStartTimer");

    // Call syncData and switchMap to the timer observable
    this.syncData().pipe(
      switchMap(() => timer(0,  60 * 1000)), // start timer immediately after syncData and then every 2 minutes
      concatMap(() => this.syncData()) // wait for syncData to complete before triggering the next syncData
    ).subscribe(() => {
      // Synchronization is complete, and 2 minutes have passed,
      // so start the timer logic here
      console.log('Timer logic here');
    });
  }



  syncData(): Observable<void> {
    console.log("on syncData");

    this.rxDBService.getProductsForSyncing().then((products: Product[]) => {
      if (products.length > 0) {
        console.log("step 1 products");
        console.log(products);

        let newProducts: Product[] = [];
        let id = 1;

        for (let i = 0 ; i<products.length ; i++){
          console.log("--1")
          console.log(products[i])
          const base64String = products[i].imageUrl;
          const fileName = `example${id}.jpg`;
          const mimeType = "image/jpeg"; // Adjust the MIME type based on your content
          console.log("--3")
          const file = this.imageService.base64ToFile(base64String, fileName, mimeType);
          console.log("--4")
          console.log(file)
          const blob = file.slice(0, file.size, file.type);
          const newBlob = new Blob([blob], { type: file.type });
          const newFile = new File([newBlob], fileName, { type: file.type });

          console.log("--5")
          console.log(products[i].image)
          products[i].image = null;
          products[i].imageUrl = null;
          console.log("--6")

          let   productNew :Product= {
            image :  newFile , ...products[i]
          }
          console.log("--7")
          console.log(productNew)

          newProducts.push(productNew);
          console.log("--8")

          id++;
          console.log("--9")

        }

        console.log("step 2 products");
        console.log(newProducts);

        const requests = newProducts.map((product) => {
          console.log("in sending each product in newProducts for online service ");
          console.log(`product name is : ${product.name}`);
          // Return the observable to be subscribed to
          return this.onlineservice.addNewProduct(product).pipe(
            tap(() => {
              console.log(`in tap() operator for product ${product.name}`);
              this.rxDBService.deleteSyncedProduct(product.key).then(() => {
                console.log(`in then() deleteSyncedProduct for product ${product.name}`);
              });
            })
          );
        });

        // Combine all requests into a single observable
        const combinedRequests = forkJoin(requests);

        // Subscribe to the combined observable
        combinedRequests.subscribe(() => {
          console.log("All requests completed");
        });
      } else {
        console.log(" no product for syncing ");

      }
    });

    return of(null);
  }
}
