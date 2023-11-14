import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from "../../models/product";

@Component({
  selector: 'app-available-products',
  templateUrl: './available-products.component.html',
  styleUrls: ['./available-products.component.css']
})
export class AvailableProductsComponent {
  @Input() product :Product
  @Output() addProductEvent :EventEmitter<Product> = new EventEmitter<Product>()
  psc :number = 1

  dec() {
    if (this.psc > 1) {
      this.psc--
    }
  }

  inc() {
    if (this.psc < this.product.quantity) {
      this.psc++
    }
  }

  addProduct() {

  }
}
