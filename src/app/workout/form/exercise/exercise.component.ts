import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ExerciseService } from '../../exercise.service';
import { getErrorMessage } from '../../../helpers/formHelpers';
import { ExerciseSearchResponse } from 'src/app/types/common';
import { Observable, startWith, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})
export class ExerciseComponent implements OnInit {
  @Input()
  group: FormGroup;
  filteredExerciseOptions: Observable<ExerciseSearchResponse[]>;
  loading$: Observable<boolean> = this.exerciseService.loading$;

  exerciseTypes = ['PRIMARY', 'SECONDARY', 'ACCESSORY'];

  constructor(private exerciseService: ExerciseService) {
  }

  ngOnInit() {
    const repsMaxControl = this.group.controls['repsMax'];

    this.group.controls['name'].valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(val => {
      this.filteredExerciseOptions = this.exerciseService.search(val);
    });


    this.group.controls['useRepsSpan'].valueChanges.subscribe(val => {
      if (val && repsMaxControl.disabled) {
        repsMaxControl.enable({ emitEvent: false });
      } else if (!val && repsMaxControl.enabled) {
        repsMaxControl.disable({ emitEvent: false });
      }
    });
  }

  getErrorMessage(control: AbstractControl<any, any>): string {
    return getErrorMessage(control);
  }

}
