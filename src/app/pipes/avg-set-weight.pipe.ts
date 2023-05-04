import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avgSetWeight'
})
export class AvgSetWeightPipe implements PipeTransform {

  transform(totalWeight: number, totalSets: number): number {
    const result = totalWeight / totalSets;
    if (isNaN(result)) {
      return 0;
    } else if ((result === Infinity)) {
      return 0;
    }

    return result;
  }

}
