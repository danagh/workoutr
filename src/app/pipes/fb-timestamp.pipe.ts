import { Pipe, PipeTransform } from '@angular/core';
import firebase from 'firebase/compat/app';

@Pipe({
  name: 'fbTimestamp'
})
export class FbTimestampPipe implements PipeTransform {

  transform(date: any): Date | string {
    if (!date) {
      return '';
    }

    const timestamp = date as firebase.firestore.Timestamp;
    return timestamp.toDate();
  }
}
