import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, AbstractControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-traning-days',
  templateUrl: './traning-days.component.html',
  styleUrls: ['./traning-days.component.css']
})
export class TraningDaysComponent implements OnInit  {
  @Input()
  selectedDays: string[] = [];

  @Input()
  form: FormGroup;

  step = 0;

  constructor(private fb: FormBuilder) {

  }

  ngOnInit() {
    for (let i = 0; i < this.selectedDays.length; i++) {
      this.days.push(this.generateNewTrainingDay(i));
    }
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  traningDayAsFormGroup(traningDay: AbstractControl<any, any>) {
    return traningDay as FormGroup;
  }

  get days() {
    return this.form.get('days') as FormArray;
  }

  private generateNewTrainingDay(index: number) {
    return this.fb.group({
      name: [this.selectedDays[index]],
      index: [index],
      exercises: this.fb.array([])
    });
  }
}
