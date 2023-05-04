import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exerciseType'
})
export class ExerciseTypePipe implements PipeTransform {

  transform(exerciseType: string): string {
    switch(exerciseType) {
      case 'PRIMARY':
        return 'Primär';
      case 'SECONDARY':
        return 'Sekundär';
      case 'ACCESSORY':
        return 'Accessoar';
      default:
        return '';
    }
  }

}
