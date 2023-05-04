import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Exercise, ExerciseResultSet } from '../../types/common';
import { getExerciseTotalForAttribute } from '../../helpers/formHelpers';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.css']
})
export class ExerciseFormComponent implements OnInit {
  @Input()
  exercise: Exercise;
  @Input()
  group: FormGroup;
  totalWeight: number = 0;
  totalReps: number = 0;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    for (let i = 0; i < this.exercise.sets; i++) {
      this.sets.push(this.newExerciseResultSet(false));
    }

    this.sets.valueChanges.subscribe((sets: ExerciseResultSet[]) => {
      this.totalWeight = getExerciseTotalForAttribute(sets, 'weight');
      this.totalReps = getExerciseTotalForAttribute(sets, 'reps');
    });
  }

  get sets() {
    return this.group.get('sets') as FormArray;
  }

  addSet(warmup: boolean) {
    const set = this.newExerciseResultSet(warmup);
    if (warmup) {
      const index = this.sets.controls.findIndex(control => {
        const group = control as FormGroup;
        return group.get('warmup')!.value === false;
      });

      if (index === -1) {
        this.sets.push(set);
      } else {
        this.sets.insert(index, set);
      }
    } else {
      this.sets.push(set)
    }
    
  }

  removeSet(index: number) {
    this.sets.removeAt(index);
  }

  private newExerciseResultSet(warmup: boolean) {
    const weightControl = this.fb.control<number | null>(null, { validators: [Validators.required] });
    const repsControl = this.fb.control<number | null>(null, { validators: [Validators.required] });

    const resultGroup = this.fb.group({
      warmup: [warmup],
      weight: weightControl,
      reps: repsControl
    });

    return resultGroup;
  }
}
