import { Component } from '@angular/core';
import {Product} from "../models/product";

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent {
  sellProducts :Product[] = []
  soldProducts :Product[] = []

  constructor() {}

  sellProduct(saleProduct: any) {
  }

  removeProduct(saleProduct: any) {
  }

  checkout() {
  }

}
