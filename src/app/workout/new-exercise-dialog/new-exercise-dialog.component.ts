import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MinValueValidator } from '../form/min-value.validator';
import { Exercise } from '../../types/common';

@Component({
  selector: 'app-new-exercise-dialog',
  templateUrl: './new-exercise-dialog.component.html',
  styleUrls: ['./new-exercise-dialog.component.css']
})
export class NewExerciseDialogComponent {
  repsControl = this.fb.control(5, [Validators.required]);
  exerciseFormGroup = this.fb.group({
    name: ['', [Validators.required]],
    type: ['PRIMARY', [Validators.required]],
    sets: [3, [Validators.required]],
    useRepsSpan: [false, [Validators.required]],
    reps: this.repsControl,
    repsMax: [{value: '', disabled: true}, [Validators.required, MinValueValidator(this.repsControl)]],
    comment: [''],
    restPeriod: ['']
  });

  constructor(
    public dialogRef: MatDialogRef<NewExerciseDialogComponent>,
    private fb: FormBuilder
  ) {

  }

  onClose() {
    this.dialogRef.close();
  }

  addExercise() {
    if (!this.exerciseFormGroup.valid) {
      return;
    }

    const value = this.exerciseFormGroup.value;
    const exercise: Exercise = {
      name: value.name!,
      type: value.type!,
      sets: value.sets!,
      useRepsSpan: value.useRepsSpan!,
      reps: value.reps!,
      repsMax: value.repsMax ? parseInt(value.repsMax) : 0,
      comment: value.comment || undefined,
      restPeriod: value.restPeriod ? parseInt(value.restPeriod) : 0
    }

    this.dialogRef.close(exercise);
  }
}
