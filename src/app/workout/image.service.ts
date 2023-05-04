import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/compat/storage';
import firebase from 'firebase/compat/app';
import { Observable, finalize, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private imagePath = 'images';
  fileRef: AngularFireStorageReference;

  constructor(private storage: AngularFireStorage) { }

  uploadFile(file: File): Observable<firebase.storage.UploadTaskSnapshot | undefined> {
    const id = Date.now();
    const filePath = `${this.imagePath}/${id}`;
    this.fileRef = this.storage.ref(filePath);

    return this.storage.upload(filePath, file).snapshotChanges();
  }
}
