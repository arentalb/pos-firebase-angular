import { Injectable } from '@angular/core';
import {DexieService} from "./dexie.service";
import {OnlineService} from "./online.service";
import {Product} from "../models/product";

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  constructor(private dexieService :DexieService , private onlineService :OnlineService) { }


 async startSync(){
   console.log("start syncing ")
    await this.dexieService.getAllProductsForSyncing().then((products:Product[])=>{

      if (products.length >0){
        for (let pro of products){
          this.onlineService.syncNewProduct(pro).subscribe(()=>{
            console.log("new product synced ")
            console.log(pro)
            this.dexieService.removeProductById(pro.key).then((key)=>{
              console.log(" product deleted with the key of " + key )
            })
          })
        }
      }else {
        console.log("no product for syncing ")

      }

  })
  }


}
