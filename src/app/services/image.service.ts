import { Injectable } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private storage: AngularFireStorage) {}

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
