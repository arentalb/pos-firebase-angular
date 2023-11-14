import {Component, EventEmitter, Output} from '@angular/core';
import {Product} from "../../models/product";
import {Category} from "../../models/category";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  @Output() productChanged = new EventEmitter<any>();

  constructor() {
  }
  product: Product ={
    name :null ,
    basePrice :null ,
    salePrice :null ,
    quantity :null ,
    image : null,
    category :null,
    sellQuantity:null ,
  }


  categoryValues = Object.values(Category);

  onSubmit(form: NgForm) {
    if (form.valid && this.product.image !== null ) {
      this.productChanged.emit(this.product)
      console.log(this.product)
    }
  }

  onImageChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.product.image = file;

    }
  }
}
