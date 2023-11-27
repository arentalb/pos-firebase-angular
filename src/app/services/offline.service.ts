import { Injectable } from '@angular/core';
import {Product} from "../models/product";
import {from, Observable, of} from "rxjs";
import {DexieService} from "./dexie.service";
import {ImageService} from "./image.service";

@Injectable({
  providedIn: 'root'
})
export class OfflineService {

  constructor(private dexieservice :DexieService , private imageservice :ImageService) { }

  saveProducts(products :Product[]){

      this.imageservice.mapProductsToBase64(products).subscribe((newproducts)=>{
        products = newproducts
        this.dexieservice.saveProducts(products).then((data)=>{
          console.log("all products added ")
          console.log(data)
        })
      })





  }
  getSavedProducts():Observable<Product[]>{

    return from(this.dexieservice.getSavedOnlineProducts())
  }

  addNewProductForSync(product: Product) :Observable<void>{
    return this.dexieservice.addNewSyncProduct(product);
  }
}
