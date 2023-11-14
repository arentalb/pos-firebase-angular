import { Component } from '@angular/core';
import {Product} from "../models/product";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  formVisibility = false
  loading = false
  error :string = null
  success :string = null
  products : Product[]



  addProduct(product :Product){

  }

  toggleForm(){
    this.formVisibility = !this.formVisibility
  }

}
