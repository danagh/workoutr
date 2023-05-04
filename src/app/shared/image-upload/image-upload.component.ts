import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ImageService } from '../../workout/image.service';
import { Observable, finalize, switchMap } from 'rxjs';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {
  @Input()
  allowedFileTypes: string = '';
  @Output()
  onUpload = new EventEmitter<string>();

  fileName: string | null = null;
  isUploading: boolean = false;

  constructor(private imageService: ImageService) {}

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    if (file) {
      this.isUploading = true;
      this.fileName = file.name;
      this.imageService.uploadFile(file)
        .pipe(
          finalize(() => {
            this.imageService.fileRef.getDownloadURL().subscribe(url => {
              this.isUploading = false;
              this.onUpload.emit(url);
            })
          })
        )
        .subscribe();
    }
  }

  onButtonClick(fileUpload: HTMLInputElement) {
    fileUpload.click();
  }
}
