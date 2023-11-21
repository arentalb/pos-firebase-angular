import { Injectable } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import {from, map, Observable} from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Product } from "../models/product";
import {ImageService} from "./image.service";

@Injectable({
  providedIn: 'root'
})
export class OnlineService {

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFireDatabase,
    private imageService :ImageService
  ) {}

  getProducts(): Observable<Product[]> {
    console.log("in getProducts ")
    const productsRef = this.db.list('products');
    return productsRef.snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => {
          const data = c.payload.val() as Product;
          const key = c.payload.key;
          data.key = key
          return {  ...data };
        });
      }),
      catchError(error => {
        console.error('Error fetching products:', error);
        throw error;
      })
    );
  }

   imageName :string = " "
  addNewProduct(product: Product): Observable<void> {
    console.log("adding new product .....")
    this.imageName = product.image.name

    return from(this.imageService.convertImageToBase64(product.image)).pipe(
      switchMap(base64Image => this.uploadImage(base64Image)),
      switchMap(imageUrl => this.saveProductToDatabase(product, imageUrl)),
      catchError(error => {
        console.error('Error adding new product:', error);
        throw error;
      })
    );
  }



  private uploadImage(image: string): Promise<string> {
    console.log(this.imageName)
    const filePath = `images/${Date.now()}_${this.imageName}`;
    console.log(filePath)
    const storageRef = this.storage.ref(filePath);
    console.log("image added successfully");
    return storageRef.putString(image, 'data_url').then(() => storageRef.getDownloadURL().toPromise());
  }

  private saveProductToDatabase(product: Product, imageUrl: string): Observable<void> {
    const productsRef = this.db.list('products');
    product.imageUrl = imageUrl;
    delete product.image;

    return new Observable<void>(observer => {
      productsRef.push(product)
        .then(() => {
          console.log("product added successfully")
          observer.next();
          observer.complete();
        })
        .catch(error => {
          console.error('Error saving product to database:', error);
          observer.error(error);
        });
    });
  }
}
