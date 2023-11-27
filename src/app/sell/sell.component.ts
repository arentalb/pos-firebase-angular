import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Product} from "../models/product";
import {SellingProductService} from "../services/selling-product.service";
import {ImageService} from "../services/image.service";
import {SellingOfflineService} from "../services/selling-offline.service";

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css'],

})
export class SellComponent implements OnInit{
  sellProducts :Product[] = []
  soldProducts :Product[] = []

  constructor(private sellingProductService :SellingProductService , private sellingOffline :SellingOfflineService) {}
  ngOnInit(): void {
    this.sellingProductService.fetchAvailableProducts().subscribe((pro)=>{
      this.sellProducts = pro


    })
    this.sellingOffline.newDataSubject.subscribe((message)=>{
      console.log(message)
      this.sellingProductService.fetchAvailableProducts().subscribe((pro)=>{
        this.sellProducts = pro
      })
    })
  }
  sellProduct(saleProduct: Product) {
    this.soldProducts.push(saleProduct)
  }

  removeProduct(saleProduct: Product) {
    const index = this.soldProducts.findIndex(p => p === saleProduct);
    if (index !== -1) {
      this.soldProducts.splice(index, 1);
    }
  }

  checkout() {
    this.sellingProductService.sellAllSoldProducts(this.soldProducts).subscribe(()=>{
      console.log("all sold products saved ")
      this.soldProducts = []
    })
  }



}
