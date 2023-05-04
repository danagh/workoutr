import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { MinValueValidator } from '../min-value.validator';


@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css']
})
export class ExercisesComponent implements OnInit {
  @Input()
  form: FormGroup;
  

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.addNewExercise();
  }

  get exercises() {
    return this.form.get('exercises') as FormArray;
  }

  addNewExercise() {
    this.exercises.push(this.generateNewExercise());
  }

  removeExercise(index: number) {
    this.exercises.removeAt(index);
  }

  exerciseGroupAsFormGroup(exerciseGroup: AbstractControl<any, any>) {
    return exerciseGroup as FormGroup;
  }

  private generateNewExercise() {
    const repsControl = this.fb.control(5, [Validators.required]);
    return this.fb.group({
      name: ['', [Validators.required]],
      type: ['PRIMARY', [Validators.required]],
      sets: [3, [Validators.required]],
      useRepsSpan: [false, [Validators.required]],
      reps: repsControl,
      repsMax: [{value: '', disabled: true}, [Validators.required, MinValueValidator(repsControl)]],
      comment: [''],
      restPeriod: ['']
    });
  }
}
