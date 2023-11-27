import {Injectable} from '@angular/core';
import {concatMap, from, map, Observable, of, toArray} from "rxjs";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {Product} from "../models/product";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private storage: AngularFireStorage) {
  }

  mapProductsToBase64(products: Product[]): Observable<Product[]> {
    let base64ImagePrefix = "data:image/png;base64,"
    return from(products).pipe(
      concatMap((product) =>
        this.downloadAndConvertToBase64(product.imageUrl).pipe(
          map((base64Data) => ({...product, imageUrl: base64ImagePrefix + base64Data})),
          catchError((error) => {
            // Log the error
            console.error(`Error processing image for product ${product.name}`, error);
            // Return a fallback value or an empty Observable to continue processing other products
            return of(product);
          })
        )
      ),
      toArray() // Convert back to an array after processing all products
    );
  }

  downloadAndConvertToBase64(imageUrl: string): Observable<string> {
    return new Observable((observer) => {
      try {
        // Create a reference to the image file
        const imageRef = this.storage.refFromURL(imageUrl);

        // Get the download URL of the image
        imageRef.getDownloadURL().subscribe((downloadUrl) => {
          // Fetch the image as a blob
          this.fetchImageBlob(downloadUrl).subscribe(
            (blob) => {
              // Convert blob to base64
              this.convertBlobToBase64(blob).subscribe(
                (base64Data) => {
                  observer.next(base64Data);
                  observer.complete();
                },
                (error) => {
                  observer.error(error);
                }
              );
            },
            (error) => {
              observer.error(error);
            }
          );
        });
      } catch (error) {
        observer.error(error);
      }
    });
  }

  private fetchImageBlob(url: string): Observable<Blob> {
    return new Observable((observer) => {
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          observer.next(blob);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  private convertBlobToBase64(blob: Blob): Observable<string> {
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = () => {
        const base64Data = reader.result as string;
        observer.next(base64Data.split(',')[1]);
        observer.complete();
      };

      reader.onerror = (error) => {
        observer.error(error);
      };
    });
  }

}
