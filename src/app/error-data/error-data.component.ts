import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataErrorService} from "../services/data-error.service";
import {Product} from "../models/product";
import {Router} from "@angular/router";
import {DexieService} from "../services/dexie.service";
import {Category} from "../models/category";
import {NgForm} from "@angular/forms";
import {OnlineService} from "../services/online.service";

@Component({
  selector: 'app-error-data',
  templateUrl: './error-data.component.html',
  styleUrls: ['./error-data.component.css']
})
export class ErrorDataComponent implements OnInit {


  products :Product[] = []
  constructor(private dataErrorService :DataErrorService ,
              private router : Router,
              private dexieService :DexieService ,
              private onlineService :OnlineService) {
  }
  ngOnInit(){
    this.dexieService.getErrorProducts().then((products)=>{
      this.products = products
    })
    this.dataErrorService.productsThatHasError.subscribe((product)=>{
      console.log("---------------")
      console.log(product)
      console.log("---------------")
      console.log(this.products)
      this.products.push(product)
      this.router.navigate(['admin','error-data'])

    })
  }


  fixProduct(pro: Product) {
    this.product = pro

  }
  product: Product ={
    name :null ,
    basePrice :null ,
    salePrice :null ,
    quantity :null ,
    image : null,
    imageUrl : null,
    category :null,
    sellQuantity:null ,
  }


  categoryValues = Object.values(Category);

  onSubmit(form: NgForm) {
    console.log(this.product)
    if (form.valid && this.product.image !== null ) {
      // this.productChanged.emit(this.product)

      this.onlineService.addNewProduct(this.product).subscribe(()=>{
        this.dexieService.deleteErrorProducts(this.product).then(()=>{
          console.log("error products fixed and deleted ")
          const index = this.products.findIndex(p => p === this.product);
          if (index !== -1) {
            this.products.splice(index, 1);
          }
        })
      })
    }
  }

  onImageChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.product.image = file;

    }

  }
}
