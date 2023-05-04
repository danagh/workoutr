import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'level'
})
export class LevelPipe implements PipeTransform {

  transform(level: string): string {
    switch(level) {
      case 'BEGINNER':
        return 'Nybörjare';
      case 'INTERMEDIATE':
        return 'Genomsnitt';
      case 'ADVANCED':
        return 'Avancerad';
      default:
        return '';
    }
  }

}
