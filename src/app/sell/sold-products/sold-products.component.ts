import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from "../../models/product";

@Component({
  selector: 'app-sold-products',
  templateUrl: './sold-products.component.html',
  styleUrls: ['./sold-products.component.css']
})
export class SoldProductsComponent {
  @Input() product :Product
  @Output() removeProductEvent :EventEmitter<any> = new EventEmitter<any>()

  removeSoldProduct() {
    this.removeProductEvent.emit(this.product)
  }
}
